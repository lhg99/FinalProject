import React, { useState } from 'react';
import Slider from "react-slick";
import styled from 'styled-components';
import { Nav, Tab } from 'react-bootstrap';
import styles from './CareVideo.module.scss';
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const SliderWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const StyledSlider = styled(Slider)`
  width: 100%;
  position: relative;

  .slick-prev::before,
  .slick-next::before {
    opacity: 0;
    display: none;
  }

  .slick-slide div {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .slick-slide div div {
    max-height: 450px !important;
    max-width: 800px !important;
  }

  .slick-dots {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
  }

  .slick-dots li button:before {
    color: #000;
  }

  .slick-dots li.slick-active button:before {
    color: #ff0000;
  }
`;

const CenterModeSlider = styled(Slider)`
  .slick-slide {
    text-align: center;
    height: 250px;
    padding: 0 10px;
  }

  .slick-prev, .slick-next {
    z-index: 1;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: #fff;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
  }

  .slick-prev {
    left: 10px;
  }

  .slick-next {
    right: 10px;
  }
`;

const ThumbnailContainer = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* Aspect ratio (16:9) */
  overflow: hidden;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ThumbnailImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
  z-index: 1;
`;

interface VideoSliderProps {
  videoIds: string[];
}

const VideoSlider: React.FC<VideoSliderProps> = ({ videoIds }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
  };

  return (
    <SliderWrapper>
      <StyledSlider {...settings}>
        {videoIds.map(id => (
          <div key={id}>
            <a
              href={`https://www.youtube.com/watch?v=${id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ThumbnailContainer>
                <ThumbnailImage
                  src={`https://img.youtube.com/vi/${id}/0.jpg`}
                  alt={`Thumbnail for video ${id}`}
                />
              </ThumbnailContainer>
            </a>
          </div>
        ))}
      </StyledSlider>
    </SliderWrapper>
  );
};

const CenterModeSliderComponent: React.FC<VideoSliderProps> = ({ videoIds }) => {
  return (
    <div className={styles.centerModeSliderContainer}>
      <CenterModeSlider
        centerMode={true}
        infinite={true}
        centerPadding="60px"
        slidesToShow={3}
        speed={500}
        autoplay={false}
        pauseOnHover
      >
        {videoIds.map(id => (
          <div key={id}>
            <a
              href={`https://www.youtube.com/watch?v=${id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ThumbnailContainer>
                <ThumbnailImage
                  src={`https://img.youtube.com/vi/${id}/0.jpg`}
                  alt={`Thumbnail for video ${id}`}
                />
              </ThumbnailContainer>
            </a>
          </div>
        ))}
      </CenterModeSlider>
    </div>
  );
};

type Level = 'beginner' | 'intermediate' | 'advanced';

type UpperBodyCategory = 'neck' | 'shoulders' | 'wrists' | 'back';
type LowerBodyCategory = 'thighs' | 'calves' | 'knees' | 'ankles';

type DetailedVideoData = {
  upperBody: Record<UpperBodyCategory, string[]>;
  lowerBody: Record<LowerBodyCategory, string[]>;
};

const detailedVideoData: DetailedVideoData = {
  upperBody: {
    neck: ["rliMW5J9Qnc", "FMOISIlhLEY", "UH9sZnQLu6I"],
    shoulders: ["mUnSpfItRf0", "rg-STUwX0h8", "KdIGgci1bz0"],
    wrists: ["YbzsPgVCxGk", "wXmOouPppGo", "Gp_pSb3XzR8"],
    back: ["jJJiR7nNeqQ", "FuOtMtFdX-w", "2YFY91RB05o"]
  },
  lowerBody: {
    thighs: ["eYideX9DjmY", "IDzWQ7SZDQM", "kOYd2oFOojc"],
    calves: ["sgu0ujzGfX4", "Pk66RnIOY_U", "GHN-v6FYVtU"],
    knees: ["u983jvHEcA0", "2ioinkMrRQQ", "zmODmWSc9Kc"],
    ankles: ["hYfKvp7JANk", "p9TuNJNIiLY", "HOMv9qpqULE"]
  }
};

const CareVideo: React.FC = () => {
  const [key, setKey] = useState<string>('upperBody');
  const [currentLevel, setCurrentLevel] = useState<Level>('beginner');

  const videoData: { [category: string]: { [level in Level]: string[] } } = {
    upperBody: {
      beginner: ["U_Tv31zKYkk", "8GBAU-xOWAw", "JIS3S6bYG0Q"],
      intermediate: ["EoGMVSORHtM", "JUgKh7i406o", "66gDfjrm-gk"],
      advanced: ["lpc1P_zj3XI", "8thMw9JyxBE", "3OFjsL-YZvs"]
    },
    lowerBody: {
      beginner: ["CAt37ltbjTI", "G7FUC6GH24k", "clAa_CFVnMY"],
      intermediate: ["_WbrQJIx1Lo", "CbhjAZmrcfw", "GUDF5zbJ3NE"],
      advanced: ["DNNcr4_IskA", "SBOdazXn9as", "PJEn3vkp2PI"]
    }
  };

  const currentCategoryVideos = videoData[key] || {};
  const videosToDisplay = currentCategoryVideos[currentLevel] || [];

  return (
    <div className={styles.pageBackground}>
      <div className={styles.videoWrapper}>
        <div className={styles.sliderContainer}>
          <h1>오늘 꼭 해야 하는 스트레칭 🤸‍♀️</h1>
          <VideoSlider videoIds={["7a7lKAZ6nWw", "mUnSpfItRf0", "f-mgnsrDWHg"]} />
        </div>

        <Tab.Container
          id="left-tabs-example"
          activeKey={key}
          onSelect={(k) => setKey(k || 'upperBody')}
        >
          <Nav variant="pills" className={styles.navContainer}>
            <Nav.Item>
              <Nav.Link
                eventKey="upperBody"
                className={`${styles.navLink} ${key === 'upperBody' ? styles.active : ''}`}
              >
                상체 스트레칭
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="lowerBody"
                className={`${styles.navLink} ${key === 'lowerBody' ? styles.active : ''}`}
              >
                하체 스트레칭
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey={key}>
              {key === 'upperBody' ? (
                ['neck', 'shoulders', 'wrists', 'back'].map(detail => (
                  <div key={detail} className={`${styles.sliderContainer}`}>
                    <h2>
                      {detail === 'neck' ? '목' :
                       detail === 'shoulders' ? '어깨' :
                       detail === 'wrists' ? '손목' : '허리'}
                    </h2>
                    <CenterModeSliderComponent
                      videoIds={detailedVideoData.upperBody[detail as UpperBodyCategory] || []}
                    />
                  </div>
                ))
              ) : (
                ['thighs', 'calves', 'knees', 'ankles'].map(detail => (
                  <div key={detail} className={`${styles.sliderContainer}`}>
                    <h2>
                      {detail === 'thighs' ? '허벅지' :
                       detail === 'calves' ? '종아리' :
                       detail === 'knees' ? '무릎' : '발목'}
                    </h2>
                    <CenterModeSliderComponent
                      videoIds={detailedVideoData.lowerBody[detail as LowerBodyCategory] || []}
                    />
                  </div>
                ))
              )}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </div>
  );
};

export default CareVideo;
