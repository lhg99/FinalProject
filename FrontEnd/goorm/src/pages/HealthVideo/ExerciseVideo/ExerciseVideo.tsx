import React, { useState, useRef } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import styled from 'styled-components';
import { Nav, Tab } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './ExerciseVideo.module.scss';

const SliderWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledSlider = styled(Slider)`
  height: 550px;
  width: 100%;
  position: relative;
  background-color: lightblue;

  .slick-prev::before,
  .slick-next::before {
    opacity: 0;
    display: none;
  }

  .slick-slide div {
    cursor: pointer;
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
  padding-bottom: 56.25%;
  overflow: hidden;
  background-color:
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
  const centerSliderRef = useRef<Slider | null>(null);

  return (
    <CenterModeSlider
      ref={centerSliderRef}
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

  return (
    <div>
      <div className={styles.sliderContainer}>
        <h1>오늘의 추천 운동</h1>
        <VideoSlider videoIds={["TMx-f-AIT58", "Y2hyGxh0QCk", "CAt37ltbjTI"]} />
      </div>

      <Tab.Container
        id="left-tabs-example"
        activeKey={key}
        onSelect={(k) => setKey(k || 'shoulders')}
      >
        <Nav variant="pills" className={styles.navContainer}>
          <Nav.Item>
            <Nav.Link eventKey="shoulders" className={styles.navLink}>어깨 운동</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="chest" className={styles.navLink}>가슴 운동</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="back" className={styles.navLink}>등 운동</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="legs" className={styles.navLink}>다리 운동</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          {Object.keys(videoData).map(category => (
            <Tab.Pane eventKey={category} key={category}>
              {['beginner', 'intermediate', 'advanced'].map(level => (
                <div key={level} className={styles.sliderContainer}>
                  <h1>
                    {level === 'beginner' ? '초급' :
                     level === 'intermediate' ? '중급' : '상급'}
                  </h1>
                  <CenterModeSliderComponent
                    videoIds={videoData[category][level as Level]}
                  />
                </div>
              ))}
            </Tab.Pane>
          ))}
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default ExerciseVideo;
