const images = [
  "images/image1.jpg",
  "images/image2.jpg",
  "images/image3.jpg",
  "images/image4.jpg",
  "images/image5.jpg",
  "images/image6.jpg",
  "images/image7.jpg",
  "images/image8.jpg",
  "images/image9.jpg"
];

let index = 0;


const img = document.getElementById("carousel-image");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const carousel = document.getElementById("carousel");


function startAutoPlay() {
 
  setInterval(() => {
    nextImage();
  }, 3000);
}



function prevImage() {
  index = index === 0 ? images.length - 1 : index - 1;
  img.src = images[index];
}


function nextImage() {
  index = (index + 1) % images.length;
  img.src = images[index];
}


prevBtn.addEventListener("click", () => {
  prevImage();
});

nextBtn.addEventListener("click", () => {
  nextImage();
});




startAutoPlay();
