let circleX = 200;
let trail = []; 
let eggs = []; // 存放蛋的数组

function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
  noCursor();
}

function draw() {
  // --- 背景层 ---
  let c_bg = color(241, 159, map(mouseX, 0, width, 100, 255)); 
  background(c_bg);

  // 1. 绘制背景感应点阵
  drawBackgroundPattern();

  // 2. 更新并绘制弹跳蛋
  // 放在人物后方，增加“避让鼠标”的交互
  for (let i = 0; i < eggs.length; i++) {
    eggs[i].avoid(mouseX, mouseY); // 鼠标拨开效果
    eggs[i].move();
    eggs[i].show();
  }

  // 3. 绘制小黄鸭拖尾
  drawDuckTrail();

  // --- 人物造型层---
  let c_line = color(196, 87, 87);
  let c_skin = color(250, 225, 210);
  let c_blush = color(253, 144, 128, mouseX);
  let c_accent = color(250, 201, 0);
  let c_eye = color(72);
  let c_pocket1 = color(241, 165, 0); 
  let c_pocket2 = color(203, 140, 0);

  stroke(c_line);
  strokeWeight(9);
  fill(c_line);
  arc(200, 210, 220, 220, 180, 360);
  rect(90, 210, 220, 100);
  ellipse(200, 325, 250, mouseY);
  ellipse(200, 325, 250, 100);
  fill(c_skin);
  stroke(c_line);
  ellipse(200, 225, 190, 165);
  fill(c_line);
  noStroke(); 
  rect(113, 140, 175, 60);
  fill(c_skin);
  triangle(190, 160, 170, 200, 180, 210);
  noStroke();
  fill(c_eye);
  ellipse(160, 228, 46, 50);
  ellipse(240, 228, 46, 50);
  fill(60, 95, 157);
  ellipse(160, 238, 26, 20);
  ellipse(240, 238, 26, 20);
  fill(255);
  circle(168, 219, 16);
  circle(248, 219, 16);
  circle(155, 228, 9);
  circle(235, 228, 9);
  fill(c_skin);
  ellipse(155, 249, 50, 10);
  ellipse(245, 249, 50, 10);
  fill(c_blush);
  ellipse(125, 265, 30, 19);
  ellipse(275, 265, 30, 19);
  ellipse(200, 255, 9, 10);
  noFill();
  stroke(c_blush);
  strokeWeight(6);
  arc(200, 270, 30, 15, 0, 190);
  noStroke();
  fill(c_accent);
  let w = map(mouseX, 0, width, 50, 200);
  let h = map(mouseY, 0, height, 30, 150);
  arc(200, 400, w, h, 180, 360);
  rect(160, 300, 80, 100);
  fill(c_pocket1);
  rect(165, 380, 70, 90);
  fill(c_pocket2);
  rect(175, 380, 10, 90);
  rect(215, 380, 10, 90);
  fill(c_accent);
  ellipse(103, 228, 10, 10);
  ellipse(296, 228, 10, 10);

  // --- 顶层：小黄鸭 ---
  drawModernDuck(mouseX, mouseY, c_eye);
}

function mousePressed() {
  // 点击生成垂直下落的蛋
  eggs.push(new Egg(mouseX, mouseY));
}

// --- 升级版 Egg 类 ---
class Egg {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-1, 1); // 初始水平扰动
    this.vy = 2; // 初始下落速度
    this.gravity = 0.2; // 重力加速度
    this.bounce = -0.7; // 弹跳系数（能量损耗）
    this.size = random(15, 22);
  }

  // 鼠标避让交互
  avoid(mx, my) {
    let d = dist(this.x, this.y, mx, my);
    if (d < 60) { // 鼠标感应范围
      let angle = atan2(this.y - my, this.x - mx);
      this.vx += cos(angle) * 0.5; // 向反方向推
      this.vy += sin(angle) * 0.5;
    }
  }

  move() {
    this.vy += this.gravity; // 应用重力
    this.x += this.vx;
    this.y += this.vy;

    // 底部边界弹跳
    if (this.y + this.size/2 > height) {
      this.y = height - this.size/2;
      this.vy *= this.bounce;
      this.vx *= 0.95; // 地面摩擦力
    }
    // 左右边界反弹
    if (this.x > width || this.x < 0) {
      this.vx *= -1;
    }
  }

  show() {
    noStroke();
    fill(255, 253, 200);
    ellipse(this.x, this.y, this.size * 0.8, this.size);
    fill(255, 255, 255, 180);
    ellipse(this.x - 3, this.y - 4, this.size * 0.3, this.size * 0.4);
  }
}

// --- 其余功能函数 ---
function drawBackgroundPattern() {
  for (let x = 0; x <= width; x += 40) {
    for (let y = 0; y <= height; y += 40) {
      let d = dist(mouseX, mouseY, x, y);
      let dotSize = map(d, 0, 400, 10, 1);
      noStroke();
      fill(255, 255, 255, 30); 
      ellipse(x, y, dotSize, dotSize);
    }
  }
}

function drawDuckTrail() {
  trail.push({x: mouseX, y: mouseY});
  if (trail.length > 15) trail.splice(0, 1);
  for (let i = 0; i < trail.length; i++) {
    let opacity = map(i, 0, trail.length, 0, 60);
    fill(255, 255, 255, opacity);
    ellipse(trail[i].x, trail[i].y + 15, i*2, i);
  }
}

function drawModernDuck(x, y, eyeCol) {
  push();
  translate(x, y);
  noStroke();
  fill(255, 200, 0);
  arc(0, 0, 90, 50, 180, 360, CHORD); 
  let wingFlap = sin(frameCount * 20) * 8; 
  fill(245, 180, 0);
  ellipse(-15, -10, 30, 15 + wingFlap); 
  fill(255, 220, 0);
  circle(0, -40, 45); 
  noFill(); stroke(255, 220, 0); strokeWeight(2);
  arc(-5, -62, 10, 15, 200, 340); arc(5, -62, 8, 12, 220, 360);
  noStroke(); fill(eyeCol);
  ellipse(10, -45, 6, 9); ellipse(25, -45, 6, 9);
  fill(255); circle(11, -47, 2); circle(26, -47, 2);
  fill(255, 100, 100, 120); circle(2, -38, 8); circle(32, -38, 8);
  stroke(180, 80, 0); strokeWeight(1); fill(255, 120, 0);
  beginShape(); vertex(15, -40); bezierVertex(35, -45, 45, -35, 40, -30); vertex(15, -30); endShape(CLOSE);
  fill(230, 100, 0); arc(25, -30, 15, 8, 0, 180);
  pop();
}