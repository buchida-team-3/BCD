import React from 'react';
import { useSpring, animated } from 'react-spring';
import bgImage from "./content/background.jpg";

function Background() {
  const [springProps, setSpringProps] = useSpring(() => ({
    to: { x: 0, y: 0 },
    config: { mass: 10, tension: 550, friction: 140 },
  }));

  return (
    <animated.div
      className="background"
      style={{
        backgroundImage: `url(${bgImage})`,
        transform: springProps.x.to((x, y) => `translate3d(${x / 10}px, ${y / 10}px, 0)`),
      }}
      onMouseMove={({ clientX: x, clientY: y }) =>
        setSpringProps({
          to: {
            x: x - window.innerWidth / 2,
            y: y - window.innerHeight / 2
          }
        })
      }
    />
  );
}

export default Background;
