
import {

    EffectComposer,
    Noise,
    Vignette,
    Glitch,
    ChromaticAberration,
    Scanline,
} from "@react-three/postprocessing";
import { BlendFunction, GlitchMode } from "postprocessing";
import { Vector2 } from "three";

export const Effects = ()=> {


    return (

        <EffectComposer>
        {/* <DepthOfField
          focusDistance={0}
          focalLength={0.02}
          bokehScale={2}
          height={480}
        /> */}
        <Glitch
          delay={new Vector2(2.5, 5.5)} // min and max glitch delay
          duration={new Vector2(0.3, 1.0)} // min and max glitch duration
          strength={new Vector2(0.1, 0.4)} // min and max glitch strength
          mode={GlitchMode.SPORADIC} // glitch mode
          active // turn on/off the effect (switches between "mode" prop and GlitchMode.DISABLED)
          ratio={0.15}
        />
        {/* <Scanline
          blendFunction={BlendFunction.OVERLAY} // blend mode
          opacity={100} // opacity of the effect
          density={1.25} // scanline density
        /> */}
        {/* <ChromaticAberration
          blendFunction={BlendFunction.NORMAL} // blend mode
          offset={[0.02, 0.002]} // color offset
        /> */}
        {/* <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} /> */}
        {/* @ts-ignore */}
        <Noise opacity={1} />
        {/* <Vignette eskil={false} offset={0.1} darkness={0.1} /> */}
        {/* <Pixelation/> */}
      </EffectComposer>
    )
}



