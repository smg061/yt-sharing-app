import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect, ComponentType } from "react";

export function WithSpinning<T extends {}> (Component: ComponentType<T>) {
    const heartRef = useRef<any>();
    const [speed, setSpeed] = useState(0.005);
  
    useFrame(() => {
      if (heartRef.current) {
        heartRef.current.rotation.y += speed;
      }
    });
  
    useEffect(() => {
      const increaseSpeed = () => setSpeed((prevSpeed) => prevSpeed + 0.001);
      const interval = setInterval(increaseSpeed, 1000);
      return () => clearInterval(interval);
    }, []);

    return (props:T) => (
        <group ref={heartRef}>
            <Component {...props} />
        </group>
    );

}