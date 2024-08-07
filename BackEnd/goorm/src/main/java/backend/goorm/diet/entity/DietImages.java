package backend.goorm.diet.entity;

import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Entity
@Table(name = "diet_images")
public class DietImages {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "diet_image_id")
    private Long dietImageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diet_id")
    private Diet diet;

    @Column(name = "image_url")
    private String imageUrl;

    public DietImages(Diet diet, String imageUrl) {
        this.diet = diet;
        this.imageUrl = imageUrl;
    }
}
