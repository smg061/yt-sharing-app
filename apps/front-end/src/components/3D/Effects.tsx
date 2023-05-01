import { extend } from "@react-three/fiber";
import RetroLoader from "../loaders/RetroLoader";
import Petal from "./Sakura";
import {
    Bloom,
    DepthOfField,
    EffectComposer,
    Noise,
    Vignette,
    Glitch,
    ChromaticAberration,
    Scanline,
    // @ts-ignore
} from "@react-three/postprocessing";
import { BlendFunction, GlitchMode } from "postprocessing";


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
          delay={[2.5, 5.5]} // min and max glitch delay
          duration={[0.3, 1.0]} // min and max glitch duration
          strength={[0.1, 0.4]} // min and max glitch strength
          mode={GlitchMode.SPORADIC} // glitch mode
          active // turn on/off the effect (switches between "mode" prop and GlitchMode.DISABLED)
          ratio={0.15}
        />
        <Scanline
          blendFunction={BlendFunction.OVERLAY} // blend mode
          density={1.25} // scanline density
        />
        {/* <ChromaticAberration
          blendFunction={BlendFunction.NORMAL} // blend mode
          offset={[0.02, 0.002]} // color offset
        /> */}
        {/* <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} /> */}
        <Noise opacity={1} />
        {/* <Vignette eskil={false} offset={0.1} darkness={0.1} /> */}
        {/* <Pixelation/> */}
      </EffectComposer>
    )
}



