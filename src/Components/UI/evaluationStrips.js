import React, { useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import ImageGallery from 'react-image-gallery';
import Skeleton from 'react-loading-skeleton';
import classnames from 'classnames';
import _ from 'lodash';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import 'react-image-gallery/styles/css/image-gallery.css';

import { useMergeState } from '../../Helpers/customHooks';
import testImage from '../../Image/Components/Form/evaluation-strips.jpg';
import CustomButton from '../Button/customButton';

const testImages = [testImage, testImage, testImage, testImage, testImage];

const EvaluationStrips = (props) => {
  const [state, setState] = useMergeState({
    isExpand: false,
    isLoading: true,
    isLoadedImageError: false,
  });
  const { stripImgs } = props;
  const createItems = (stripImgs) => {
    const notIncludedAllStripImgs = _.filter(stripImgs, x => !_.includes(x, 'all.svg'));
    return _.map(notIncludedAllStripImgs, (stripImg, index) => (
      {
        original: stripImg,
        thumbnail: stripImg,
        description: `${index + 1}/${notIncludedAllStripImgs.length}`,
      }
    ));
  };

  const renderLeftNav = (onClick, disabled) => (
    <CustomButton
      className="image-gallery-custom-nav left"
      disabled={disabled}
      onClick={onClick}
      icon={<LeftOutlined color="white" />}
    />
  );

  const renderRightNav = (onClick, disabled) => (
    <CustomButton
      className="image-gallery-custom-nav right"
      disabled={disabled}
      onClick={onClick}
      icon={<RightOutlined color="white" />}
    />
  );

  const onImageLoad = () => {
    if (state.isLoading) {
      setState({ isLoading: false });
    }
  };

  const onImageError = () => {
    if (state.isLoading) {
      setState({ isLoading: false, isLoadedImageError: true });
    }
  };

  return (
    <>
      <ImageGallery
        items={createItems(stripImgs)}
        infinite={false}
        showPlayButton={false}
        showFullscreenButton={false}
        showBullets
        lazyLoad
        disableArrowKeys
        slideDuration={250}
        startIndex={0}
        thumbnailPosition="bottom"
        renderLeftNav={renderLeftNav}
        renderRightNav={renderRightNav}
        onImageLoad={onImageLoad}
        onImageError={onImageError}
      />

      {
        state.isLoading
          ? (
            <div className="loading-thumbnail">
              <Skeleton height="100%" />
            </div>
          )
          : state.isLoadedImageError && (
            <div className="loading-thumbnail --error">
              There is an error while loading ECG strips
            </div>
          )
      }
    </>
  );
};

EvaluationStrips.defaultProps = {
  stripImgs: [],
};
EvaluationStrips.propTypes = {
  stripImgs: PropTypes.array,
};


export default EvaluationStrips;
