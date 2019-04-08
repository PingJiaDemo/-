let makeParticle = {
    effectParam:function (effectArr,edgeStrength,edgeGlow,edgeThickness,pulsePeriod,usePatternTexture,vColor,hColor) {
        effectArr.push(new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera));
        composer.addPass(effectArr[eIndex]);

        visibleEdgeColor = new THREE.Color( vColor );
        hiddenEdgeColor = new THREE.Color( hColor );
        effectArr[eIndex].edgeStrength = edgeStrength;                //  强度 默认3
        effectArr[eIndex].edgeGlow = edgeGlow;                        //  羽化强度 默认1
        effectArr[eIndex].edgeThickness = edgeThickness;              //  边缘浓度
        effectArr[eIndex].pulsePeriod = pulsePeriod;                  //  闪烁频率 默认0 值越大频率越低
        effectArr[eIndex].usePatternTexture = usePatternTexture;      //  使用纹理
        effectArr[eIndex].visibleEdgeColor = visibleEdgeColor;        //  边缘可见部分发光颜色
        effectArr[eIndex].hiddenEdgeColor = hiddenEdgeColor;          //  边缘遮挡部分发光颜色
        // loader.load(imgPath, onLoad);                                 //  纹理加载

        eIndex++;
    },
    effectBinding:function (obj,effectPar) {
        effectPar.selectedObjects = obj;
    }
};