import React from 'react';
import Skeleton from 'react-loading-skeleton';

const StudyCardSkeleton = () => (
  <div className="study-card skeleton-study-card-container">
    <div className="header-container">
      <div className="header-container__left">
        <Skeleton height="100%" />
      </div>
    </div>
    <div className="body-container">
      <div className="body-container__left">
        <div className="study-info">
          <Skeleton height="100%" />
        </div>

        <div className="study-duration">
          <Skeleton height="100%" />
        </div>
      </div>
      <div className="body-container__right">
        <Skeleton height="100%" />
      </div>
    </div>
  </div>
);

export default StudyCardSkeleton;
