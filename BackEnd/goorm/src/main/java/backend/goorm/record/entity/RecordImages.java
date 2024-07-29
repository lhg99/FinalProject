package backend.goorm.record.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "record_images")
public class RecordImages {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "record_image_id")
    private Long recordImageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "record_id", nullable = false)
    private Record record;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    public RecordImages(Record record, String imageUrl) {
        this.record = record;
        this.imageUrl = imageUrl;
    }
}
