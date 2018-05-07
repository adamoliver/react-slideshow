import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './zoom.css';

class Zoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: []
    };
    this.imageRefs = [];
    this.width = 0;
    this.height = 0;
    this.timeout = null;
    this.imageContainer = null;
    this.getImageDim = this.getImageDim.bind(this);
  }

  componentWillMount() {
    this.timeout = setTimeout(
      () => this.fadeImages('next'),
      this.props.duration
    );
    this.setState({
      images: this.props.children.reverse()
    });
  }

  componentDidMount() {
    this.width = document.querySelector('.react-slideshow-zoom-wrapper').clientWidth;
    this.applyStyle();
    this.addResizeListener();
  }

  getImageDim() {
    this.height = this.imageContainer.children[0].clientHeight;
    this.imageContainer.style.height = `${this.height}px`;
  }

  addResizeListener() {
    window.addEventListener('resize', () => {
      this.width = document.querySelector('.react-slideshow-zoom-wrapper').clientWidth;
      this.applyStyle();
    });
  }

  applyStyle() {
    this.imageRefs.forEach((eachImage, index) => {
      eachImage.style.width = `${this.width}px`;
    });
  }

  render() {
    const { type } = this.props;
    const { images } = this.state;
    return (
      <div className="react-slideshow-container">
        <div className="nav" onClick={() => this.fadeImages('prev')}>
          {' '}&lt;{' '}
        </div>
        <div className={`react-slideshow-zoom-wrapper ${type}`}>
          <div
            className="images-wrap"
            ref={wrap => (this.imageContainer = wrap)}
          >
            {images.map((each, key) =>
              <div
                ref={el => {
                  this.imageRefs.push(el);
                }}
                onLoad={key === 0 ? this.getImageDim : null}
                data-index={key}
                key={key}
              >
                {each}
              </div>
            )}
          </div>
        </div>
        <div className="nav" onClick={() => this.fadeImages('next')}>
          {' '}&gt;{' '}
        </div>
      </div>
    );
  }

  fadeImages(type) {
    let { images } = this.state;
    let newImageArr = [];
    clearTimeout(this.timeout);
    const lastImage = this.imageContainer.children[images.length - 1];
    if (type === 'prev') {
      newImageArr = images.slice(1);
      newImageArr.splice(newImageArr.length - 1, 0, images[0]);
      this.setState({ images: newImageArr });
      newImageArr = images.slice(1, images.length);
      newImageArr.splice(newImageArr.length, 0, images[0]);
    } else {
      newImageArr = [images[images.length - 1]].concat(
        images.slice(0, images.length - 1)
      );
    }
    lastImage.style.transition = `all ${this.props.transitionDuration / 1000}s`;
    lastImage.style.opacity = '0';
    lastImage.style.transform = `scale(${this.props.scale})`;
    setTimeout(() => {
      lastImage.style.opacity = '1';
      lastImage.style.transform = `scale(1)`;
      lastImage.style.transition = 'none';
      this.timeout = setTimeout(
        () => this.fadeImages('next'),
        this.props.duration
      );
      this.setState({ images: newImageArr });
    }, this.props.transitionDuration);
  }
}

Zoom.defaultProps = {
  duration: 5000,
  transitionDuration: 1000
};

Zoom.propTypes = {
  duration: PropTypes.number,
  transitionDuration: PropTypes.number,
  scale: PropTypes.string.isRequired
};
export default Zoom;
