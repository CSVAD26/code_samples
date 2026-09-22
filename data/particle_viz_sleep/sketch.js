let circles = [];
let table;
let sleepTable;
let distance = [];
let labels = [];
let energy = [];
let duration = [];
let sleepDuration = []; // Sleep duration for each workout date
let tooltipGraphics;

function preload() {
  // Make sure your CSV is in the same folder as the sketch
  table = loadTable('cycling_workouts.csv', 'csv', 'header');
  sleepTable = loadTable('apple_health_sleep.csv', 'csv', 'header');
}

function setup() {
  createCanvas(2000, 400);
  tooltipGraphics = createGraphics(2000, 400);
  // draw() will run continuously to support hover interaction

  // Extract all values from CSV
  for (let r = 0; r < table.getRowCount(); r++) {
    let workoutDate = table.getString(r, 'startDate');
    labels.push(formatDate(workoutDate));
    distance.push(float(table.getString(r, 'totalDistance_miles')));
    console.log(distance[r]);
    energy.push(float(table.getString(r, 'totalEnergyBurned_cal')));
    duration.push(float(table.getString(r, 'duration_minutes')));
    console.log(energy[r]);
    
    // Calculate sleep duration for this workout date
    let sleep = calculateSleepForDate(workoutDate);
    sleepDuration.push(sleep);
    console.log(`Sleep for ${labels[r]}: ${sleep} hrs`);
    
    let normalizedDuration = map(duration[r], 0, 120, 5,0.1);
    let normalizedEnergy = map(energy[r], 0, 200, 1,20);
    let normalizedDistance = map(distance[r], 0, 20, 0, 270);
    //constructor(r,velocity,hue,sleepHours){
    circles.push(new Circle(normalizedEnergy, normalizedDuration, normalizedDistance, sleep));

  }

  // initial frame will be drawn in draw()
}


function draw() {
  background(20);

  const center = createVector(width / 2, height / 2);

  for (let c of circles) {
    c.update();
    c.show();
  }
  drawTooltip(duration, energy, distance, labels);
}

function drawTooltip(values1,values2,values3,labels) {
  
  tooltipGraphics.clear();
  const maxValue1 = max(values1);
  const maxValue2 = max(values2);
  const maxValue3 = max(values3);

  for (let i = 0; i < circles.length; i++) {
    const h = map(values1[i], 0, maxValue1, 0, height - 80);
    

    // Only show tooltip when the mouse is over this circle
    const mouseDist = circles[i].mouseOver(mouseX, mouseY);
    if (mouseDist) {
      // Prepare tooltip content: date + distance, energy, duration
      const dKm = values3[i];
      const kcal = values2[i];
      const hours = values1[i];
      const lines = [
        `${labels[i]}`,
        `Distance: ${nf(dKm, 1, 1)} miles`,
        `Energy: ${round(kcal)} cal`,
        `Duration: ${nf(hours, 1, 2)} min`
      ];

      push();
      // Draw a floating tooltip near the mouse
      tooltipGraphics.colorMode(RGB);
      tooltipGraphics.textAlign(LEFT, TOP);
      tooltipGraphics.textSize(12);
      const padding = 8;
      // Compute tooltip width by longest line
      let tw = 0;
      for (let t of lines) { tw = max(tw, textWidth(t)); }
      let boxW = tw + padding * 2;
      let lineH = 16;
      let boxH = lines.length * lineH + padding * 2;
      let tipX = constrain(mouseX + 12, 0, width - boxW - 1);
      let tipY = constrain(mouseY - (boxH + 12), 0, height - boxH - 1);
      // Background and border
      tooltipGraphics.noStroke();
      tooltipGraphics.fill(0, 0, 0, 200);
      tooltipGraphics.rect(tipX, tipY, boxW, boxH, 6);
      // Text
      tooltipGraphics.fill(255);
      for (let li = 0; li < lines.length; li++) {
        tooltipGraphics.text(lines[li], tipX + padding, tipY + padding + li * lineH);
      }
      pop();
    }
  }
  image(tooltipGraphics, 0, 0);
}

// Circle class
class Circle {
  constructor(r,velocity,hue,sleepHours){
    this.pos = createVector(random(width), 0);
    this.vel = createVector(0, velocity);
    this.acc = createVector(0, 0);
    this.r = r;
    this.hue = hue;
    this.sleepHours = sleepHours;
    // Calculate deceleration factor: less sleep = more slowdown
    this.decelerationFactor = map(sleepHours, 0, 10, 0.75, 0.999);
    this.decelerationFactor = constrain(this.decelerationFactor, 0.75, 0.999);
  }

  applyForce(f) {
    this.acc.add(f);
  }

  update() {
    this.vel.add(this.acc);
   //this.vel.limit(2); // damp motion
    
    // Apply deceleration based on sleep duration
    // Less sleep = faster slowdown
    this.vel.mult(this.decelerationFactor);
    
    this.pos.add(this.vel);
    //this.acc.mult(0);

    // keep inside canvas bounds
    if(this.pos.y > height || this.pos.y < 0 ){
      this.vel.y = this.vel.y * -1; // reverse and dampen velocity
    }
  
  }

  show() {
    colorMode(HSB);
    fill(this.hue, 255, 255, 180);
    circle(this.pos.x, this.pos.y, this.r * 2);
  }
  mouseOver(mx, my) {
    let d = dist(mx, my, this.pos.x, this.pos.y);
    return d < this.r;
  }
}

function formatDate(datetimeStr) {
  // Split on space → ["2023-10-16", "14:08:33", "-0700"]
  let datePart = datetimeStr.split(" ")[0];
  
  // Split date part → ["2023", "10", "16"]
  let parts = datePart.split("-");
  let year = parts[0].slice(2); // get last two digits
  let month = parts[1];
  let day = parts[2];

  return `${month}/${day}/${year}`;
}

// Calculate total sleep duration for the night before a given workout date
function calculateSleepForDate(workoutDateStr) {
  // Parse workout date (format: "2023-10-16 14:08:33 -0700")
  let workoutDatePart = workoutDateStr.split(" ")[0]; // "2023-10-16"
  let [year, month, day] = workoutDatePart.split("-").map(x => parseInt(x));
  
  // Create Date object for the workout day at midnight
  let workoutDay = new Date(year, month - 1, day);
  
  // Define the night before: from 12:00 PM previous day to 12:00 PM workout day
  let nightStart = new Date(workoutDay);
  nightStart.setDate(nightStart.getDate() - 1);
  nightStart.setHours(12, 0, 0, 0);
  
  let nightEnd = new Date(workoutDay);
  nightEnd.setHours(12, 0, 0, 0);
  
  // Sum all sleep durations that fall within this window
  let totalSleep = 0;
  for (let i = 0; i < sleepTable.getRowCount(); i++) {
    let sleepStart = sleepTable.getString(i, 'start');
    let sleepDur = float(sleepTable.getString(i, 'duration_hrs'));
    
    // Parse sleep start time
    let sleepDatePart = sleepStart.split(" ")[0];
    let [sYear, sMonth, sDay] = sleepDatePart.split("-").map(x => parseInt(x));
    let sleepTime = sleepStart.split(" ")[1]; // "19:00:00"
    let [sHour, sMin, sSec] = sleepTime.split(":").map(x => parseInt(x));
    
    let sleepDate = new Date(sYear, sMonth - 1, sDay, sHour, sMin, sSec);
    
    // Check if this sleep entry falls within the night window
    if (sleepDate >= nightStart && sleepDate < nightEnd) {
      totalSleep += sleepDur;
    }
  }
  
  return totalSleep;
}
