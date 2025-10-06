import React, {useId} from 'react'

interface SpotLightProps {
  bgcolor?: String;
  height?: String;
    width?: String;
    blur?: String;
    left?: String;
    top?: String;
    translateX?: String;
    translateY?: String;
}

const SpotLight = React.forwardRef<HTMLDivElement, SpotLightProps>(function spotLight({
bgcolor= "",
height= "",
width= "",
blur= "",
left= "",
top= "",
translateX= "",
translateY= "",
...props
}, ref ){
    const id = useId();
    return (
        <div id={id} className={`overflow-x-hidden rounded-full absolute ${bgcolor} ${height} ${width} ${blur} ${left} ${top} ${translateX} ${translateY}`} {...props}
        ref={ref}
    >

    </div>
    )
})
SpotLight.displayName = "SpotLight";
export default SpotLight;
