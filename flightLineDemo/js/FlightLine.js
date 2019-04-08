
//在球体上产生随机点
function SetRandomDots(group,radius) {
    console.log("SetRandomDot");
    let dotgro=new THREE.SphereGeometry(10,20,20);
    let dotMatr=new THREE.MeshPhongMaterial({
        color:'#0ff'
    });
    let dotmesh=new THREE.Mesh(dotgro,dotMatr);
    let pos=getPos(radius,Math.PI*2*Math.random(),Math.PI*2*Math.random());
    dotmesh.position.set(pos.x,pos.y,pos.z);
    group.add(dotmesh);

}

// 球面取点方法
function getPos( radius,a,b) {
    //根据两个夹角 一个半径 可以一个球体上的所有点
   let x=radius*Math.sin(a)*Math.cos(b);
   let y=radius*Math.sin(a)*Math.sin(b);
   let z=radius*Math.cos(a);
   return {x,y,z};
}

//添加线条
function Addlines(v0,v3) {
    //夹角
    let angle=v0.angleTo(v3)*270/Math.PI/10;
    let aLen=angle*50,
        hLen=angle*angle*120;
    let p0=new THREE.Vector3(0,0,0);

    //法向量
    let rayLine=new THREE.Ray(p0,GetVCenter(v0.clone(),v3.clone()));
    // 顶点坐标
    let vtop = rayLine.at(hLen / rayLine.at(1).distanceTo(p0));
    // 控制点坐标
    let v1 = getLenVcetor(v0.clone(), vtop, aLen);
    let v2 = getLenVcetor(v3.clone(), vtop, aLen);

    //绘制贝塞尔曲线
    let curve=new THREE.CubicBezierCurve3(v0,v1,v2,v3);
    let geometry=new THREE.Geometry();
    geometry.vertices=curve.getPoints(50);
    let material=new THREE.LineBasicMaterial({color:0xffffff })
    return{
        curve:curve,
        lineMesh: new THREE.Line(geometry,material)
    }
}
//计算v0,v3的中点
function GetVCenter(v1,v2) {
    let v=v1.add(v2);
    return v.divideScalar(2);
}
// 计算V1，V2向量固定长度的点
function getLenVcetor(v1, v2, len) {
    let v1v2Len = v1.distanceTo(v2);
    return v1.lerp(v2, len / v1v2Len);
}