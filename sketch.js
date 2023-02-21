const K = 15;
const T = 5;

let original_img;
let compressed_img;

let partition = [];
let configuration = [];

function preload() {
  original_img = loadImage("assets/bird.png");
  compressed_img = createImage(200, 200);
}

function init_configuration() {
  for (let i = 0; i < K; i++) {
    configuration.push(
      color(random(255), random(255), random(255), random(255))
    );
  }
}

function init_partition() {
  for (let i = 0; i < K; i++) {
    partition.push([]);
  }
}

function assign_points() {
  original_img.loadPixels();
  partition = [];
  init_partition();

  for (let y = 0; y < original_img.height; y++) {
    for (let x = 0; x < original_img.width; x++) {
      let index = (x + y * original_img.width) * 4;
      let c = color(
        original_img.pixels[index],
        original_img.pixels[index + 1],
        original_img.pixels[index + 2]
      );

      min_centroid_index = get_centroid_for_point(c);
      partition[min_centroid_index].push([x, y]);
    }
  }
}

function recalculate_centroids() {
  original_img.loadPixels();
  for (let i = 0; i < K; i++) {
    let len = partition[i].length;
    let sum_r = 0;
    let sum_g = 0;
    let sum_b = 0;
    for (let j = 0; j < len; j++) {
      let [x, y] = partition[i][j];
      let c = original_img.get(x, y);
      let r = red(c);
      let g = green(c);
      let b = blue(c);

      sum_r += r / len;
      sum_g += g / len;
      sum_b += b / len;
    }

    configuration[i] = color(int(sum_r), int(sum_g), int(sum_b));
  }
}

function get_centroid_for_point(c) {
  let min_d = 500;
  let min_centroid_index = 0;

  for (let i = 0; i < K; i++) {
    let d = distance(c, configuration[i]);
    if (d < min_d) {
      min_d = d;
      min_centroid_index = i;
    }
  }

  return min_centroid_index;
}

function distance(c1, c2) {
  c1_r = red(c1);
  c1_g = green(c1);
  c1_b = blue(c1);

  c2_r = red(c2);
  c2_g = green(c2);
  c2_b = blue(c2);

  return sqrt(sq(c1_r - c2_r) + sq(c1_g - c2_g) + sq(c1_b - c2_b));
}

function build_compressed_image() {
  compressed_img.loadPixels();

  for (let i = 0; i < K; i++) {
    let len = partition[i].length;
    console.log(len);
    for (let j = 0; j < len; j++) {
      let [x, y] = partition[i][j];
      compressed_img.set(x, y, configuration[i]);
    }
  }

  compressed_img.updatePixels();
}

function setup() {
  createCanvas(1000, 1000);
  background(22);
  pixelDensity(1);
}

function draw() {
  init_configuration();
  init_partition();
  for (let t = 0; t < T; t++) {
    assign_points();
    recalculate_centroids();
  }
  build_compressed_image();

  image(original_img, 0, 0);
  image(compressed_img, original_img.width, 0);
  noLoop();
}
