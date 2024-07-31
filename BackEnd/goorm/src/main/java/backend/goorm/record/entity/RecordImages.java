package backend.goorm.record.entity;

import backend.goorm.record.entity.Record;
import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "record_images")
public class RecordImages {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "record_image_id")
    private Long recordImageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "record_id")
    @JsonBackReference
    private Record record;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;
}
