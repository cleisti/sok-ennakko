import React, { useEffect, useRef, useState } from 'react';

import { dismissBanner, shouldShow } from './utils';
import './top-banner.css';

// typet/interfacet voisi vielä mahdollisesti olla omassa filussa mutta ei välttämättä tarpeellista tässä sillä näitä interfaceja ei käytetä muualla
type WrapperProps = {
  theme: TopBannerTheme;
  linkUrl?: string;
  children: React.ReactElement[];
  setHeight: React.Dispatch<React.SetStateAction<number>>;
};

const Wrapper = ({
  theme,
  linkUrl,
  children,
  setHeight,
}: WrapperProps) => {
  const styles = {
    background: theme.background,
    color: theme.textColor,
  };

  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight);
    }
  }, [setHeight]);

  return (
    <>
      {linkUrl ? (
        <a
          ref={ref}
          className={'top-banner-container'}
          style={styles}
          href={linkUrl}
        >
          {children}
        </a>
      ) : (
        <div ref={ref} className={'top-banner-container'} style={styles}>
          {children}
        </div>
      )}
    </>
  );
};

const CancelIcon: React.FunctionComponent<{
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}> = ({ className = 'cancel', onClick }) => (
  <div className={className} onClick={(e) => onClick(e)}>
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.29293 8.00001L0.146484 15.1465L0.853591 15.8536L8.00004 8.70711L15.1465 15.8536L15.8536 15.1465L8.70714 8.00001L15.8536 0.853561L15.1465 0.146454L8.00004 7.2929L0.853591 0.146454L0.146484 0.853561L7.29293 8.00001Z"
        fill="#484848"
      />
    </svg>
  </div>
);

const CloseButton: React.FunctionComponent<{
  close: (event?: React.MouseEvent | MouseEvent) => void;
}> = ({ close }) => {
  return (
    <div className={'close-button-wrapper'}>
      <CancelIcon className="cancel" onClick={(e) => close(e)} />
    </div>
  );
};

// henk.kohtaisesti tykkään pitää interfacet suoraan komponenttien yllä jos ovat samassa filussa
interface TopBannerImage {
  description: string;
  url: string;
}

interface TopBannerTheme {
  name: string;
  background: string;
  textColor: string;
  closeBtnHoverBackground: string;
  closeBtnActiveBackground: string;
}

interface TopBannerConfig {
  name: string;
  mainContent: string;
  linkUrl?: string;
  linkText?: string;
  image?: TopBannerImage;
  theme: TopBannerTheme;
  componentId: string;
}

interface TopBannerProps {
  config: TopBannerConfig;
}

const TopBanner: React.FunctionComponent<TopBannerProps> = ({
  config: { name, mainContent, linkUrl, linkText, image, theme, componentId },
}): JSX.Element | null => {
  const [showBanner, setShowBanner] = useState(false);
  const [height, setHeight] = useState<number>(0);
  const [heightInView, setHeightInView] = useState<number>(0);

  useEffect(() => {
    // en nyt ihan tajunnut tän height/heightInView pointtia mutta nyt se ainakin tekee jotain
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      setHeightInView(scrollY < height ? height + scrollY : 0);
    });
    const bannerContainer = document.getElementById(componentId);
    bannerContainer?.style.setProperty(
      '--top-banner-height-in-view',
      `${heightInView}px`
    );
  }, [height, heightInView, componentId]);

  useEffect(() => {
    setShowBanner(shouldShow(name));
    const bannerContainer = document.getElementById(componentId);
    if (bannerContainer) {
      console.log('document: ', bannerContainer);
      bannerContainer.style.setProperty(
        '--close-btn-hover-background',
        theme.closeBtnHoverBackground
      );
      bannerContainer.style.setProperty(
        '--close-btn-active-background',
        theme.closeBtnActiveBackground
      );
      bannerContainer.style.setProperty(
        '--top-banner-text-color',
        theme.textColor
      );
    }
  }, [componentId, name, theme.closeBtnActiveBackground, theme.closeBtnHoverBackground, theme.textColor]);

  const hasLink = linkUrl && linkText;

  return showBanner ? (
    <div id={componentId}>
      <Wrapper
        theme={theme}
        linkUrl={hasLink ? linkUrl : undefined}
        setHeight={setHeight}
      >
        <div className={'content-container'}>
          {image && (
            <img
              className={'top-banner-image'}
              alt={image.description}
              src={image.url}
            />
          )}
          {/* mainContent nyt pakollinen kun muuten bannerissa ei mitään kontenttia */}
          <div className={'top-banner-main-content'}>
            {mainContent} {hasLink ? <span>{linkText}</span> : ''}
          </div>
        </div>
        <CloseButton
          close={(e) => {
            e.preventDefault();
            dismissBanner(name);
            setShowBanner(false);
          }}
        />
      </Wrapper>
    </div>
  ) : null;
};

export default TopBanner;

