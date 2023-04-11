/* eslint-disable react/no-children-prop */
import {
  CarouselProvider,
  Image,
  Slide,
  Slider,
  ButtonNext,
  ButtonBack,
  DotGroup,
} from 'pure-react-carousel'
import React from 'react'
import 'pure-react-carousel/dist/react-carousel.es.css'

type CarouselProps = {
  imageURL: string
  imageURL2: string
  imageURL3: string
  imageURL4: string
}

const DesktopCarousel = ({ imageURL, imageURL2, imageURL3, imageURL4 }: CarouselProps) => (
  <CarouselProvider
    naturalSlideWidth={1}
    naturalSlideHeight={1}
    totalSlides={4}
    hasMasterSpinner
    lockOnWindowScroll={true}
  >
    <div style={{ position: 'relative' }}>
      <Slider>
        <Slide tag='a' index={0}>
          <Image hasMasterSpinner src={imageURL} alt='' />
        </Slide>
        <Slide tag='a' index={1}>
          <Image hasMasterSpinner src={imageURL2} alt='' />
        </Slide>
        <Slide tag='a' index={2}>
          <Image hasMasterSpinner src={imageURL3} alt='' />
        </Slide>
        <Slide tag='a' index={3}>
          <Image hasMasterSpinner src={imageURL4} alt='' />
        </Slide>
      </Slider>
      <br></br>
      <ButtonBack
        style={{
          position: 'absolute',
          top: '45%',
          left: '-20px',
          background: 'transparent',
          border: 'none',
        }}
        children='<'
      />
      <ButtonNext
        style={{
          position: 'absolute',
          top: '45%',
          right: '-20px',
          background: 'transparent',
          border: 'none',
        }}
        children='>'
      />
    </div>
    <DotGroup />
  </CarouselProvider>
)

export default DesktopCarousel

