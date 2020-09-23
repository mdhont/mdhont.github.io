
const range = (min, max) => Math.floor(min + Math.random() * (max + 1 - min))
var testx,testy,testz,testdot,positions,now
const entries = [
	{ color: 0xcc8b3a, height: 1 },
	{ color: 0x563071, height: 2 },
	{ color: 0x3c4b6e, height: 4 },
	{ color: 0x8f221f, height: 8 }
]

class Sphere {
	constructor() {
        
		this.scene = new THREE.Scene()
		this.camera = new THREE.PerspectiveCamera(
		50,
			window.innerWidth / window.innerHeight,
			1,
			1000
		)
		this.mouse = new THREE.Vector2()
        this.camera.position.z = 0.9
        this.camera.position.x = 0.7
        this.camera.position.y = 0.7
        this.camera.rotation.z *= 0.3
        
		this.group = new THREE.Group()
		this.clock = new THREE.Clock()
		this.renderer = new THREE.WebGLRenderer({ antialias: true })
		this.renderer.setSize(window.innerWidth, window.innerHeight)
		this.renderer.setPixelRatio(window.devicePixelRatio * 1.5)
		this.raycaster = new THREE.Raycaster()
        this.container = document.getElementById( 'canvas_holder' );
    

    this.renderer.setSize( 256, 256 );
    this.container.appendChild( this.renderer.domElement );
		
		this.cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
	}

	bindEvents = () => {
		window.addEventListener('click', this.onClick)
	}

	init() {
        this.renderScene()
		this.bindEvents()
		this.setupLights()
		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
		this.controls.update()
		this.scene.add(this.group)
        setInterval(this.positionPoints,this.interval);
		return this
	}

	setupLights = () => {
        var color="rgb(235, 64, 52)";
		const pointLight = new THREE.DirectionalLight(color, 5, 60)
		pointLight.position.set(0, 0, 0)
		this.lightHolder = new THREE.Group()
		this.lightHolder.add(pointLight)
		this.scene.add(this.lightHolder)
		this.light = new THREE.SpotLight(0xffffff)
		this.light.castShadow = true
		this.light.shadow.mapSize.width = 50
		this.light.shadow.mapSize.height = 50
		this.light.shadow.camera.near = 500
		this.light.shadow.camera.far = 3000
		this.light.shadow.camera.fov = 75
		this.scene.add(this.light)
	}

	prev = null
	outline = null
	shouldRotate = false

	onClick = event => {
		if (this.isInUpdateMode) return
		this.mouse.x = event.clientX / window.innerWidth * 2 - 1
		this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
		this.raycaster.setFromCamera(this.mouse, this.camera)
		let intersects = this.raycaster.intersectObjects(this.points)
        if (intersects[0]) {
            const item = intersects[0]
            var point = item.point;
            var camDistance = this.camera.position.length();
            this.camera.position.copy(point).normalize().multiplyScalar(camDistance);
            this.controls.update();

			if (this.outline) {
				this.group.remove(this.outline)
			}
			let outlineMaterial = new THREE.MeshBasicMaterial({
				color: 0xffffff,
				side: THREE.FrontSide,
				wireframe: true
			})
			let outlineMesh = new THREE.Mesh(this.cubeGeometry, outlineMaterial)
			const { x, y, z } = item.object.position
			const { x: sx, y: sy, z: sz } = item.object.scale
			outlineMesh.position.set(x, y, z)
			outlineMesh.scale.set(sx, sy, sz)
			outlineMesh.lookAt(this.center)
			this.group.add(outlineMesh)
			this.outline = outlineMesh
			if (this.prev) {
				TweenMax.to(this.prev.object.material, 1, { emissiveIntensity: 0 })
			}
			TweenMax.to(item.object.material, 1, { emissiveIntensity: 0.9 })
			this.shouldRotate = false
			this.prev = item;
		} else {
			this.shouldRotate = false 
		}
	}
    
	calcSphere = (x,y,z,r) => {
        return (x-r)*(x-r)+(y-r)*(y-r)+(z-r)*(z-r) 
    }
	getDistribution = n => {
		const rnd = 1
		const offset = 2 / n
		const increment = Math.PI * (3 - Math.sqrt(5))
		return Array(n)
			.fill(null)
			.map((_, i) => {
				const y = i * offset - 1 + offset / 2
				const r = Math.sqrt(1 - Math.pow(y, 2))
				const phi = ((i + rnd) % n) * increment
				return {
					x: Math.cos(phi) * r,
					z: Math.sin(phi) * r,
					y
				}
			})
	}
    
	renderScene = () => {
        this.pArr = {};
		this.toggle = this.toggle ? false : true;
        this.size=54;
        this.density=1;
        this.dotsize=3;
        this.interval=7000
        this.speed=0.19;
        const dotGeometry = new THREE.Geometry();
        dotGeometry.vertices.push(new THREE.Vector3( -(this.size/200),-(this.size/200),-(this.size/200)));
        const dotSetting = { size: this.dotsize, sizeAttenuation: false }
        for (var x = 0; x < this.size; x++) {
            for (var y = 0; y < this.size; y++) {
                for (var z = 0; z < this.size; z++) {
                this.toggle = this.toggle ? false : true;
                var posId = x+"_"+y+"_"+z;
                var r_color=Math.round((255 / this.size) * x)
                var g_color=Math.round((255 / this.size) * y)
                var b_color=Math.round((255 / this.size) * z)
                var color="rgb("+r_color+","+b_color+","+g_color+")";
                dotSetting.color = new THREE.Color(color);
                var dotMaterial = new THREE.PointsMaterial(dotSetting);
                this.pArr[posId] = new THREE.Points(dotGeometry, dotMaterial);
                this.pArr[posId].material.color= new THREE.Color(color);
                this.pArr[posId].xpos = x;
                this.pArr[posId].ypos = y;
                this.pArr[posId].zpos = z;
                this.pArr[posId].position.x = x/100;
                this.pArr[posId].position.y = y/100;
                this.pArr[posId].position.z = z/100;
                this.group.add(this.pArr[posId]);
                var total=x+y+z
                var sphere = Math.round(this.calcSphere(x,y,z,this.size/2)/100)
                 if(sphere>1){
                    this.pArr[posId].material.transparent = true
                    this.pArr[posId].material.opacity = 0                                     
                }
                
            }
        }
    }
}
	positionPoints = () => {
        for (var x = 0; x < this.size; x++) {
            for (var y = 0; y < this.size; y++) {
                for (var z = 0; z < this.size; z++) {
               var posId = x+"_"+y+"_"+z;
               this.pArr[posId].xpos = calc_00(this.pArr[posId].xpos,this.size)
               this.pArr[posId].ypos = calc_00(this.pArr[posId].ypos,this.size)
               this.pArr[posId].zpos = calc_00(this.pArr[posId].zpos,this.size)
               this.pArr[posId].position.x = this.pArr[posId].xpos/100;
               this.pArr[posId].position.y = this.pArr[posId].ypos/100;
               this.pArr[posId].position.z = this.pArr[posId].zpos/100;
                }                      
            }   
            }
        }
        render = timestampv=> {
            if (this.shouldRotate) {
                if (!this.start) this.start = timestamp
                const progress = timestamp - this.start
                this.group.rotation.y = progress * 0.00005
                this.group.rotation.z = progress * 0.000025
            }
            this.lightHolder.quaternion.copy(this.camera.quaternion)
            this.light.position.copy(this.camera.position)
            this.renderer.render(this.scene, this.camera)
            requestAnimationFrame(this.render)
        }
	
}

function calc_00($x, $w) {

    if ($x % 2 == 0) {
      var Newx = ($w / 2) + ($x / 2);
      return Newx;
  
    } else {
      var Newx = ($x - 1) / 2;
      return Newx;
    }
  
  }

function calc_180($x, $w) {
    if ($x % 2 == 0) {
      var Newx = $w - ($x / 2);
      return Newx - 1;
    } else {
      var Newx = (($x + 1) / 2);
      return Newx - 1;
    }
  }
  
  function calc_90($x, $y, $z, $w) {
  if ($x % 2) {
    $evenx = false;
  } else {
    $evenx = true;
  }
  if ($y % 2) {
    $eveny = false;
  } else {
    $eveny = true;
  }
  if ($z % 2) {
    $evenz = false;
  } else {
    $evenz = true;
  }

  if (!$evenx && !$eveny && !$evenz) {
    $x1 = ($x - 1) / 2;
    $y1 = ($y - 1) / 2;
    $z1 = ($z - 1) / 2;
  }
  if (!$evenx && !$eveny && $evenz) {
    $x1 = ($x - 1) / 2;
    $y1 = ($y - 1) / 2;
    $z1 = ($w - 1) - ($z / 2);
  }
  
if (!$evenx && $eveny && !$evenz) {
    $x1 = ($w - 1) - ($y / 2);
    $y1 = ($x - 1) / 2;
    $z1 = ($z - 1) / 2;
  }
  if ($evenx && !$eveny && $evenz) {
    $x1 = ($y - 1) / 2;
    $y1 = ($w - 1) - ($x / 2)
    $z1 = ($w - 1) - ($z / 2);
  }  
  
  if (!$evenx && $eveny && $evenz) {
    $x1 = ($w - 1) - ($y / 2);
    $y1 = ($x - 1) / 2;
    $z1 = ($w - 1) - ($z / 2);
  }

  if ($evenx && !$eveny && !$evenz) {
    $x1 = ($y - 1) / 2;
    $y1 = ($w - 1) - ($x / 2)
    $z1 = ($z - 1) / 2;
  }
  
  if ($evenx && $eveny && !$evenz) {
    $x1 = ($w - 1) - ($x / 2);
    $y1 = ($w - 1) - ($y / 2);
    $z1 = ($z - 1) / 2;
  }
  if ($evenx && $eveny && $evenz) {
    $x1 = ($w - 1) - ($x / 2);
    $y1 = ($w - 1) - ($y / 2);
    $z1 = ($w - 1) - ($z / 2);
  } 
  return new Array($x1, $y1, $z1);
}


window.onload = function(){
    new Sphere().init().render()
}

