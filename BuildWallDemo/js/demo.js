if (WEBGL.isWebGLAvailable() === false) {

    document.body.appendChild(WEBGL.getWebGLErrorMessage());

}

var camera, scene, renderer;
var mouse, raycaster;
var plane;
let orbitControl, transControl;
var helperPoint, point00,point01;
var  objects=new Array();;
var isAdd=false;
var selectMesh;
init();
modeLoad();
addListener();
render();

function init() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(1200, 1200, 0);
    camera.lookAt(0, 0, 0);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // lights
    var ambientLight = new THREE.AmbientLight(0x606060);
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 0.75, 0.5).normalize();
    scene.add(directionalLight);

    //renderer
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.domElement.id = 'canvas';

    //controls orb
    orbitControl = new THREE.OrbitControls(camera, renderer.domElement);

    // trans control
    transControl = new THREE.TransformControls(camera, renderer.domElement);
   // transControl.addEventListener('change',render);
     transControl.addEventListener('dragging-changed',function (event) {
         orbitControl.enabled=!event.value;

     })

    raycaster=new THREE.Raycaster();
    mouse = new THREE.Vector2();

}

function addListener() {
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove',onMouseMove,false);
    //只监听canves画布，不监听UI
    document.getElementById('canvas').addEventListener('click',OnClick,false);
}
function modeLoad() {
    //grid
    var gridHelper = new THREE.GridHelper(1000, 100);
    console.log(gridHelper);
    scene.add(gridHelper);
    //json 导入的scene模型 得用mesh面辅助显示
    var geometry = new THREE.PlaneBufferGeometry(1000, 1000);
    geometry.rotateX(-Math.PI / 2);
    plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({visible: false}));
    scene.add(plane);
    objects.push(plane);
    //加载json模型

    var  jsonLoader=new THREE.ObjectLoader();
    jsonLoader.load('mod/level6.json',function (obj) {
        obj.scale.set(0.03,0.03,0.03);
        obj.position.set(-340, -476,220);
        obj.rotateX(Math.PI/180*270);
        scene.add( obj );
        render();
    })
    //helperPoint
    var helperPointGeo=new THREE.CircleGeometry(10,10);
    helperPointGeo.rotateX(-Math.PI/2 );
    var helperPointMaterial=new THREE.MeshPhongMaterial({color:0xFF0000,opacity:0.6,transparent:true});
    helperPoint=new THREE.Mesh(helperPointGeo,helperPointMaterial);
  // scene.add(helperPoint);

    //Point
    var pointGro=new THREE.SphereGeometry(10,20,10);
    var pointMaterial=new THREE.MeshPhongMaterial({color: 0xFF0000});
    point00=new THREE.Mesh(pointGro,pointMaterial);
    // scene.add(point);
     //point01
    point01=new THREE.Mesh(pointGro,pointMaterial);

}
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}
function onMouseMove(event) {
//取消默认事件
    event.preventDefault();

    if(isAdd) {
        //将鼠标的屏幕坐标转换成世界坐标
        mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);

        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObjects(objects);

        if (intersects.length > 0) {

            var intersect = intersects[0];
            helperPoint.position.copy(intersect.point).add(intersect.face.normal);
            //使每次只移动一个单位
            helperPoint.position.divideScalar(10).floor().multiplyScalar(10);
            //   rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
            //    rollOverMesh.position.divideScalar( 10 ).floor().multiplyScalar( 10 ).addScalar( 2.5 );

        }
    }

}
var i=0;
function OnClick() {
    if(isAdd) {
        i++;
        if (i == 1) {
            point00.position.copy(helperPoint.position);
            point00.name='point00';
            scene.add(point00);
        }
        if (i == 2) {
            i = 0;
            point01.position.copy(helperPoint.position);
            point01.name='point01';
            scene.add(point01);
            buildWall();

            orbitControl.enabled = true;
        }
    }
 //   point.position.copy(helperPoint.position);
    //选中模型
    if(isAdd==false)
    {
        mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(objects);

        if (intersects.length > 0) {
            if (intersects[0].object.name == 'wall') {
                selectMesh = intersects[0].object;
                transControl.attach(selectMesh);
                scene.add(transControl);

            }
            else {
                scene.remove(transControl);
                //点击canves的其他，移除；点UI不移除
              //  if(event.path[0].id=='canvas'){
                //    scene.remove(transControl);
               // }

               // console.log('移除');
            }
        }
    }
    render();
}
function render() {
    orbitControl.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

function buildWall() {
    var weight;
    let LX=point01.position.x-point00.position.x;
    let Lz=point01.position.z-point00.position.z;
    weight=Math.sqrt(Math.pow(LX,2)+Math.pow(Lz,2));
    var wallGeo=new THREE.BoxGeometry(weight,120,10);
    var wallMat=new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load('img/texutre/clay1.jpg',render)});
    var wallmesh=new THREE.Mesh(wallGeo,wallMat);
    //位置
    var wallpos=THREE.Vector3.prototype.addVectors(point01.position,point00.position).divideScalar(2);
  //  console.log(wallpos);
    wallmesh.position.set(wallpos.x,wallpos.y+60,wallpos.z);
    //方向
    var angle=Math.asin(Lz/weight);//.rotateY 用的是弧度！！
    //第一个点的x小于第二个点x ，就是逆时针
    if(LX<0){
        wallmesh.rotateY(angle);
    }
    else {
        wallmesh.rotateY(-angle);
    }

    wallmesh.name='wall';
   // wallmesh.material.map.texture.src='img/texutre/clay1.jpg';
    scene.add(wallmesh);
    scene.remove(point01);
    scene.remove(point00);
    scene.remove(helperPoint);
    isAdd=false;
    objects.push(wallmesh);
}

//几个按钮事件
function addBut() {
    isAdd=true;
    camera.position.set(0, 1200, 0);
    orbitControl.enabled = false;
    scene.add(helperPoint);
}

function deleteMesh() {
    if(selectMesh)
    {
    if(selectMesh.name=='wall')
    {
        scene.remove(selectMesh);
        scene.remove(transControl);
        selectMesh=null;
    }
    }
    else {
        alert("无选中模型");
    }
}

function transMod() {
    if (selectMesh) {
        transControl.setMode('translate');
    }
    else {
        alert("无选中模型");
    }
}
function rotateMod() {
    if (selectMesh) {
    transControl.setMode('rotate');
}
else {
    alert("无选中模型");
}
}
function scaleMod() {
    if (selectMesh) {
    transControl.setMode('scale');
    }
    else {
        alert("无选中模型");
    }
}

function changeTex(index) {
    if(selectMesh){
        console.log(selectMesh.name);
        //map 必须 有初始值
        selectMesh.material.map.needsUpdate=true;
        selectMesh.material.map.wrapS=THREE.RepeatWrapping;//贴图的重复方式
        selectMesh.material.map=new THREE.TextureLoader().load('img/texutre/clay'+index +'.jpg',render);
   }
}