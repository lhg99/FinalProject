import React, { useState } from 'react';
import Slider from "react-slick";
import styled from 'styled-components';
import { Nav, Tab } from 'react-bootstrap';
import styles from './ExerciseVideo.module.scss';
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

interface VideoData {
  [category: string]: {
    [level in Level]: string[];
  };
}

const ExerciseVideo: React.FC = () => {
  const [key, setKey] = useState<string>('shoulders');
  const [currentLevel, setCurrentLevel] = useState<Level>('beginner');

  const videoData: VideoData = {
    shoulders: {
      beginner: ["U_Tv31zKYkk", "8GBAU-xOWAw", "JIS3S6bYG0Q"],
      intermediate: ["EoGMVSORHtM", "JUgKh7i406o", "66gDfjrm-gk"],
      advanced: ["lpc1P_zj3XI", "8thMw9JyxBE", "3OFjsL-YZvs"]
    },
    chest: {
      beginner: ["CAt37ltbjTI", "G7FUC6GH24k", "clAa_CFVnMY"],
      intermediate: ["_WbrQJIx1Lo", "CbhjAZmrcfw", "GUDF5zbJ3NE"],
      advanced: ["DNNcr4_IskA", "SBOdazXn9as", "PJEn3vkp2PI"]
    },
    back: {
      beginner: ["hHcdb6q9aaE", "eppTwxOicew", "5jZ940J6w6Y"],
      intermediate: ["dKNpfuRxrZU", "OJevd3OyNNo", "3vKhZRSNm0Y"],
      advanced: ["mPZVkhu4hC0", "pSLsxN0d_7g", "jXZYPzZ-dfQ"]
    },
    legs: {
      beginner: ["CAt37ltbjTI", "CAt37ltbjTI", "CAt37ltbjTI"],
      intermediate: ["CAt37ltbjTI", "CAt37ltbjTI", "CAt37ltbjTI"],
      advanced: ["CAt37ltbjTI", "CAt37ltbjTI", "CAt37ltbjTI"]
    }
  };

  const currentCategoryVideos = videoData[key] || {};
  const videosToDisplay = currentCategoryVideos[currentLevel] || [];
  
  return (
    <div className={styles.pageBackground}>
      <div className={styles.videoWrapper}>
        <div className={styles.sliderContainer}>
          <h1>오늘의 추천 운동은? 🏃‍♀️</h1>
          <VideoSlider videoIds={["TMx-f-AIT58", "Y2hyGxh0QCk", "CAt37ltbjTI"]} />
        </div>

        <Tab.Container
          id="left-tabs-example"
          activeKey={key}
          onSelect={(k) => setKey(k || 'shoulders')}
        >
          <Nav variant="pills" className={styles.navContainer}>
            {['shoulders', 'chest', 'back', 'legs'].map(category => (
              <Nav.Item key={category}>
                <Nav.Link
                  eventKey={category}
                  className={`${styles.navLink} ${key === category ? styles.active : ''}`}
                >
                  {category === 'shoulders' ? '어깨 운동' :
                   category === 'chest' ? '가슴 운동' :
                   category === 'back' ? '등 운동' : '하체 운동'}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey={key}>
              {['beginner', 'intermediate', 'advanced'].map(level => (
                <div key={level} className={`${styles.sliderContainer} ${level === 'advanced' ? styles.advancedSection : ''}`}>
                  <h2>
                    {level === 'beginner' ? '초급' :
                     level === 'intermediate' ? '중급' : '상급'}
                  </h2>
                  <CenterModeSliderComponent
                    videoIds={videoData[key][level as Level] || []}
                  />
                </div>
              ))}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </div>
  );
};

export default ExerciseVideo;
