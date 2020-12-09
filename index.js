let canvas = document.querySelector("canvas")
let  c = canvas.getContext("2d")
const scoreId = document.querySelector("#scoreId")
const startGameBtn = document.querySelector("#startGameBtn")
const bigC = document.querySelector("#bigC")
const finalScore = document.querySelector("#finalScore")
const fid = document.querySelector("#fid")

canvas.width = innerWidth
canvas.height = innerHeight
class Player{
	constructor(x,y,radius,color){
		this.x=x
		this.y=y
		this.radius=radius
		this.color=color
	}
	draw(){
		c.beginPath()
		c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
		c.fillStyle = this.color
		c.fill()
	}
}
class Projectile{
	constructor(x,y,radius,color,velocity){
		this.x=x
		this.y=y
		this.radius=radius
		this.color=color
		this.velocity = velocity
	}
	draw(){
		c.beginPath()
		c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
		c.fillStyle = this.color
		c.fill()
	}
	update(){
		this.draw()
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y
	}
}
class Enemy{
	constructor(x,y,radius,color,velocity){
		this.x=x
		this.y=y
		this.radius=radius
		this.color=color
		this.velocity = velocity
	}
	draw(){
		c.beginPath()
		c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
		c.fillStyle = this.color
		c.fill()
	}
	update(){
		this.draw()
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y
	}
}
class Particle{
	constructor(x,y,radius,color,velocity){
		this.x=x
		this.y=y
		this.radius=radius
		this.color=color
		this.velocity = velocity
		this.alpha = 1
	}
	draw(){
		c.save()
		c.globalAlpha = this.alpha
		c.beginPath()
		c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
		c.fillStyle = this.color
		c.fill()
		c.restore()
	}
	update(){
		this.draw()
		this.velocity.x = this.velocity.x*0.99
		this.velocity.y = this.velocity.y*0.99
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y
		this.alpha = this.alpha - 0.01
	}
}


let player = new Player(canvas.width/2,canvas.height/2,10,"white")
let projectiles = []
let enemies = []
let particles = []

function init(){
player = new Player(canvas.width/2,canvas.height/2,10,"white")
projectiles = []
enemies = []
particles = []
score = 0
                    }

addEventListener("click",(event)=>{
	let angle = Math.atan2(event.clientY-canvas.height/2,event.clientX-canvas.width/2)
	let velocity = {
		x:Math.cos(angle)*3,
		y:Math.sin(angle)*3
	}
	projectiles.push(new Projectile(canvas.width/2,canvas.height/2,5,"white",velocity))
})


function spawnEnemies(){
	setInterval(()=>{
		let x
		let y
		if(Math.random()<0.5){
			if(Math.random()<0.5){
				x=Math.random()*canvas.width
				y=0
			}else{
				x=Math.random()*canvas.width
				y=canvas.height
			}
		}else{
			if(Math.random()<0.5){
				x=0
				y=Math.random()*canvas.height
			}else{
				x=canvas.width
				y=Math.random()*canvas.height
			}
		}
	const radius = (Math.random()*15) + 10
	const color = `hsl(${Math.random()*360},50%,50%)`
	const angle = Math.atan2(player.y-y,player.x-x)
	const velocity = {x:Math.cos(angle),y:Math.sin(angle)}
	enemies.push(new Enemy(x,y,radius,color,velocity))},800)
}

let animateId
let score =0
function animate(){
	animateId= requestAnimationFrame(animate)
	c.fillStyle = "rgba(0,0,0,0.11)"
	c.fillRect(0,0,canvas.width,canvas.height)
	player.draw()
	particles.forEach((particle,partilceIndex)=>{
		if(particle.alpha<=0){
			particles.splice(partilceIndex,1)
		}else{
			particle.update()
		}
		if(particle.x<0||particle.x>canvas.width||particle.y<0||particle.y>canvas.height){
			projectiles.splice(partilceIndex,1)
		}else{
			particle.update()
		}
	})
	projectiles.forEach((projectile,projectileIndex)=>{
		if(projectile.x<0||projectile.x>canvas.width||projectile.y<0||projectile.y>canvas.height){
			projectiles.splice(projectileIndex,1)
		}else{
			projectile.update()
		}
	})
	enemies.forEach((enemy,enemyIndex)=>{
		enemy.update()
		const dist = Math.hypot(player.x-enemy.x,player.y-enemy.y)
		if(dist-player.radius-enemy.radius<0){
			cancelAnimationFrame(animateId)
			bigC.style.display="flex"
			fid.innerHTML = score

		}
		projectiles.forEach((projectile,projectileIndex)=>{
			const dist = Math.hypot(projectile.x-enemy.x,projectile.y-enemy.y)
			if(dist - projectile.radius - enemy.radius<0){
				score = score +10
				scoreId.innerHTML=score
				
				for(i=0;i<enemy.radius*3;i++){
					particles.push(new Particle(
						projectile.x,
						projectile.y,
						Math.random()*2,
						enemy.color,
						{
							x:(Math.random()-0.5)*(Math.random()*8),
							y:(Math.random()-0.5)*(Math.random()*8)
						}))
				}
				setTimeout(()=>{
					if(enemy.radius>20){
						enemy.radius = enemy.radius - 10
						projectiles.splice(projectileIndex,1)
					}else{
						enemies.splice(enemyIndex,1)
				    projectiles.splice(projectileIndex,1)
					}
				},0)
			}
		})
	})
}
startGameBtn.addEventListener("click",()=>{
	init()
	animate()
spawnEnemies()
bigC.style.display="none"
})
