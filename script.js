const fileInput = document.querySelector(".datei-oeffnen"),
filterOptions = document.querySelectorAll(".filter button"),
filterName = document.querySelector(".filter-info .name"),
filterWert = document.querySelector(".filter-info .wert"),
filterSlider = document.querySelector(".slider input"),
drehOptionen = document.querySelectorAll(".drehen button"),
previewImg = document.querySelector(".vorschaubild img"),
resetBtn = document.querySelector(".filter-zurücksetzen"),
chooseImgBtn = document.querySelector(".weahle-bild"),
saveImgBtn = document.querySelector(".speicher-bild");

let brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

const applyFilter = () => {
  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

const loadImage = () => {
  let file = fileInput.files[0];
  if(!file) return;
  previewImg.src = URL.createObjectURL(file);
  previewImg.addEventListener("load", () => {
    resetBtn.click();
    document.querySelector(".container").classList.remove("disable");
  });
}

filterOptions.forEach(option => {
  option.addEventListener("click", () => {
    document.querySelector(".filter .aktiv").classList.remove("aktiv");
    option.classList.add("aktiv");
    filterName.innerText = option.innerText;

    if(option.id === "Helligkeit") {
      filterSlider.max = "200";
      filterSlider.value = brightness;
      filterWert.innerText = `${brightness}%`;
    } else if (option.id === "Sättigung") {
      filterSlider.max = "200";
      filterSlider.value = saturation;
      filterWert.innerText = `${saturation}%`;
    } else if (option.id === "Umkehrung") {
      filterSlider.max = "100";
      filterSlider.value = inversion;
      filterWert.innerText = `${inversion}%`;
    } else {
      filterSlider.max = "100";
      filterSlider.value = grayscale;
      filterWert.innerText = `${grayscale}%`;
    }
  });
});

const updateFilter = () => {
  filterWert.innerText = `${filterSlider.value}%`;
  const selectedFilter = document.querySelector(".filter .aktiv");

  if(selectedFilter.id === "Helligkeit") {
    brightness = filterSlider.value;
  } else if(selectedFilter.id === "Sättigung") {
    saturation = filterSlider.value;
  } else if(selectedFilter.id === "Umkehrung") {
    inversion = filterSlider.value;
  } else {
    grayscale = filterSlider.value;
  }
  applyFilter();
}

drehOptionen.forEach(option => {
  option.addEventListener("click", () => {
    if(option.id === "links") {
      rotate -= 90;
    } else if(option.id === "rechts") {
      rotate += 90;
    } else if(option.id === "horizontal") {
      flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    } else {
      flipVertical = flipVertical === 1 ? -1 : 1;
    }
    applyFilter();
  });
});

const resetFilter = () => {
  brightness = 100; saturation = 100; inversion = 0; grayscale = 0;
  rotate = 0; flipHorizontal = 1; flipVertical = 1;
  filterOptions[0].click();
  applyFilter();
}

const saveImg = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = previewImg.naturalWidth;
  canvas.height = previewImg.naturalHeight;

  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  if(rotate !== 0) {
    ctx.rotate(rotate * Math.PI / 180);
  }
  ctx.scale(flipHorizontal, flipVertical);
  ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
  //document.body.appendChild(canvas);

  const link = document.createElement("a");
  link.download = "bild.jpg";
  link.href = canvas.toDataURL();
  link.click();
}

fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
resetBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImg);
chooseImgBtn.addEventListener("click", () => fileInput.click());
