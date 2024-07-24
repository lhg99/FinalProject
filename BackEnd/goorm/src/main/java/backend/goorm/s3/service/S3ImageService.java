package backend.goorm.s3.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.util.IOUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLDecoder;
import java.util.*;

@Slf4j
@Service
public class S3ImageService {

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucketName}")
    private String bucketName;

    public S3ImageService(AmazonS3 amazonS3) {
        this.amazonS3 = amazonS3;
    }

    public String upload(MultipartFile image) {
        if (image.isEmpty() || Objects.isNull(image.getOriginalFilename())) {
            log.error("Empty file received for upload.");
            throw new RuntimeException("Empty file.");
        }
        log.info("Uploading image: {}", image.getOriginalFilename());
        return this.uploadImage(image);
    }

    public List<String> uploadMulti(MultipartFile[] image) {
        List<String> urls = new ArrayList<>();
        for(int i = 0; i < image.length; i++) {
            urls.add(uploadImage(image[i]));
        }

        return urls;
    }


    private String uploadImage(MultipartFile image) {
        this.validateImageFileExtension(image.getOriginalFilename());
        try {
            return this.uploadImageToS3(image);
        } catch (IOException e) {
            log.error("Error uploading file to S3: {}", image.getOriginalFilename(), e);
            throw new RuntimeException("Error uploading file.", e);
        }
    }

    private void validateImageFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf(".");
        if (lastDotIndex == -1) {
            log.error("No file extension found for file: {}", filename);
            throw new RuntimeException("No file extension.");
        }

        String extension = filename.substring(lastDotIndex + 1).toLowerCase();
        List<String> allowedExtensionList = Arrays.asList("jpg", "jpeg", "png", "gif");

        if (!allowedExtensionList.contains(extension)) {
            log.error("Invalid file extension for file: {}", filename);
            throw new RuntimeException("Invalid file extension.");
        }
    }

    private String uploadImageToS3(MultipartFile image) throws IOException {
        String originalFilename = image.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));

        String s3FileName = UUID.randomUUID().toString().substring(0, 10) + originalFilename;
        log.info("Generated S3 file name: {}", s3FileName);

        InputStream is = image.getInputStream();
        byte[] bytes = IOUtils.toByteArray(is);

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType("image/" + extension);
        metadata.setContentLength(bytes.length);
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);

        try {
            PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, s3FileName, byteArrayInputStream, metadata)
                    .withCannedAcl(CannedAccessControlList.PublicRead);
            amazonS3.putObject(putObjectRequest);
            log.info("Successfully uploaded image to S3: {}", s3FileName);
        } catch (Exception e) {
            log.error("Error putting object to S3: {}", s3FileName, e);
            throw new RuntimeException("Error putting object to S3.", e);
        } finally {
            byteArrayInputStream.close();
            is.close();
        }

        return amazonS3.getUrl(bucketName, s3FileName).toString();
    }

    public void deleteImageFromS3(String imageAddress) {
        String key = getKeyFromImageAddress(imageAddress);
        try {
            amazonS3.deleteObject(new DeleteObjectRequest(bucketName, key));
            log.info("Successfully deleted image from S3: {}", imageAddress);
        } catch (Exception e) {
            log.error("Error deleting object from S3: {}", imageAddress, e);
            throw new RuntimeException("Error deleting object from S3.", e);
        }
    }

    private String getKeyFromImageAddress(String imageAddress) {
        try {
            URL url = new URL(imageAddress);
            String decodingKey = URLDecoder.decode(url.getPath(), "UTF-8");
            return decodingKey.substring(1);
        } catch (MalformedURLException | UnsupportedEncodingException e) {
            log.error("Error decoding image address: {}", imageAddress, e);
            throw new RuntimeException("Error decoding image address.", e);
        }
    }

}
