//兼容性判断
if(WEBGL.isWebGLAvailable()===false){
    document.boby.appendChild(WEBGL.getWebGLErrorMessage());
}
let container,stats;
let camera,scene,renderer,controls;
let width = window.innerWidth;
let height = window.innerHeight;
let composer ,renderPass,outlinePass;

let [radius,vIndex,eIndex] = [600,0,0];

let groupDots=new THREE.Group();
let groupLines=new THREE.Group();
let aGroup = new THREE.Group();//飞行点数组

let kk = new Array();
let kz = new Array();
let effectArray = new Array(); //特效组

init();
model();
effectComposer();
animate();

function init() {
    //画布
    container=document.createElement('div');
    document.body.appendChild(container);

    console.log("init执行");
    //
    renderer=new THREE.WebGLRenderer({
        alpha:true,
        antialias: true,//反锯齿
        preserveDrawingBuffer:true //保存绘图缓冲
    });
    renderer.shadowMap.enabled=true;
    renderer.setSize(width,height);
    document.body.appendChild(renderer.domElement);

    //
    scene=new THREE.Scene();
    camera=new THREE.PerspectiveCamera(45,width/height,1,10000);
    camera.position.set(-2000,2000,2000);
    camera.lookAt({x:0,y:0,z:0});
    scene.add(camera);
    //
    controls=new THREE.OrbitControls(camera,renderer.domElement);
    controls.enablePan=false;//不平行移动
    controls.enableDamping=true;
    controls.dampingFactor=0.25;

    //
    let light=new THREE.DirectionalLight(0xddffdd,0.6);
    light.position.set(1,1,1);

    scene.add(light);
    scene.add(new THREE.AmbientLight(0xaaaaaa,0.6));

    //后期处理
     composer=new THREE.EffectComposer(renderer);
     renderPass=new THREE.RenderPass(scene,camera);
     composer.addPass(renderPass);

    //帧
    stats=new Stats();
   container.appendChild(stats.dom);

    window.addEventListener('resize', onWindowResize, false);

}
function onWindowResize() {
    camera.aspect=width/height;
    camera.updateProjectionMatrix();

    renderer.setSize(width,height);
  //  composer.setSize(width,height);



}
function model()
{
    //地球
    let earthGeo=new THREE.SphereGeometry(radius,100,100);
    let earthMater=new THREE.MeshPhongMaterial({
        map:new THREE.TextureLoader().load('image/earth.jpg'),
        side: THREE.DoubleSide
    });
    let earthmesh=new THREE.Mesh(earthGeo,earthMater);
    scene.add(earthmesh);

    //定位点
    for(let i=0;i<100;i++){

        SetRandomDots(groupDots,radius);

    }
   scene.add(groupDots);

    //飞行线
    let animateDots=[];//2维数组，存了100条线，每条线100个点
    groupDots.children.forEach(elem=>{
        let line=Addlines(groupDots.children[0].position,elem.position);
        groupLines.add(line.lineMesh);
        animateDots.push(line.curve.getPoints(100));

    });
    scene.add(groupLines);

    //飞行点
    console.log("groupLines.length  "+animateDots.length);
    for(let i=0;i<animateDots.length;i++){
        let geo=new THREE.SphereGeometry(10,10,10);
        let Mater=new THREE.MeshPhongMaterial({color:0xff0000});
        let amesh=new THREE.Mesh(geo,Mater);
        aGroup.add(amesh);
    }
    scene.add(aGroup);
    //飞行点的动画

    function animateLine() {
        aGroup.children.forEach((elem, index) => {
            let v = animateDots[index][vIndex];
         //   console.log(animateDots[index][vIndex]);
            elem.position.set(v.x, v.y, v.z);
        });
        vIndex++;
        if (vIndex > 100) {
            vIndex = 0;
        }
        requestAnimationFrame(animateLine);
    }

    //开始动画
    animateLine();
}
//增加特效
function effectComposer() {
    aGroup.children.forEach((elem)=>{
        kz.push(elem);
    })
    // 自定义outlinePass配置
    makeParticle.effectParam(effectArray,1.2,0.32,1.2,0,false,0x3aaafa,0xFF0000);
    makeParticle.effectParam(effectArray,1.2,0.32,1.2,0,false,0xfa3939,0xFF0000);

    // 将outlinePass绑定到模型上 地球和飞行点有不同的outlinepass
    makeParticle.effectBinding(kk,effectArray[0]);
    makeParticle.effectBinding(kz,effectArray[1]);

    //必须有这个，要不渲染不出来 因为要有输出屏幕的接口
    effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);//抗锯齿
    effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    effectFXAA.renderToScreen = true;
    composer.addPass(effectFXAA);

}
function animate() {

    requestAnimationFrame(animate);

    stats.begin();

    controls.update();

    composer.render();

    stats.end();

}
