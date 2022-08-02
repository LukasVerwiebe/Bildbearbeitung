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

/* Startwerte der Filter */
let brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

/* Funktion zum Anwenden der Filtereinstellung auf das Ausgewählte Bild */
const applyFilter = () => {
  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

/* Funktion zum einfügen des Bildes auf der vorgesehenen Anzeigefläche*/
const loadImage = () => {
  // Aufruf des eingefügten Bildes
  let file = fileInput.files[0];
  // Rückgabe, wenn kein Bild ausgewählt ist
  if(!file) return;
  // Das ausgewählte Bild wird das als ersatz für den Platzhalter eingefügt
  previewImg.src = URL.createObjectURL(file);
  previewImg.addEventListener("load", () => {
    resetBtn.click();
    document.querySelector(".container").classList.remove("disable");
  });
}

/*  */
filterOptions.forEach(option => {
  // Für das Event "click" wird ein EventListener eingefügt. Betrifft alle Filter button
  option.addEventListener("click", () => {
    document.querySelector(".filter .aktiv").classList.remove("aktiv");
    option.classList.add("aktiv");
    filterName.innerText = option.innerText;

    // Speichern der jeweiligen Sliderwerte
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

/* Funktion zum setzen der Filter Button */
const updateFilter = () => {
  filterWert.innerText = `${filterSlider.value}%`;
  // Zwischenspeichern des betätigten Filter Buttons
  const selectedFilter = document.querySelector(".filter .aktiv");

  // Je nach einstellung des Sliders werden die Werte des Bildes eingestellt
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

/* Funktion zum Anwenden der Dreh- und Rotationswerte */
drehOptionen.forEach(option => {
  // Für das Event "click" wird ein EventListener eingefügt. Betrifft alle Dreh- und Rotationsbutton
  option.addEventListener("click", () => {
    // Die Berechnung der Rotation geschieht mit dem Gradwert 90. (Plus oder Minus Rechnung)
    if(option.id === "links") {
      rotate -= 90;
    } else if(option.id === "rechts") {
      rotate += 90;
    } else if(option.id === "horizontal") { // Wenn der flipHorizontal Wert auf 1 steht muss dieser auf -1 gesetzt werden oder auf 1 bleiben
      flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    } else { // Wenn der flipVertical Wert auf 1 steht muss dieser auf -1 gesetzt werden oder auf 1 bleiben
      flipVertical = flipVertical === 1 ? -1 : 1;
    }
    applyFilter();
  });
});

/* Funktion für den Zurücksetzen Button. Alle Werte werden auf die Anfangswerte zurückgesetzt*/
const resetFilter = () => {
  brightness = 100; saturation = 100; inversion = 0; grayscale = 0;
  rotate = 0; flipHorizontal = 1; flipVertical = 1;
  // Standardmäßig soll der Helligkeitsbutton ausgewählt sein, deswegen wird dieser aufgerufen
  filterOptions[0].click();
  applyFilter();
}

/* Funktion für des Download der geänderten Datei.
Dazu muss die geänderte Datei zuerst erstellt und dann gespeichert werden */
const saveImg = () => {
  // Zu beginn wird ein "canvas" Elelemnt erzeugt
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  // Die Größe des neuen Bildes wird auf die Werte des ursprungsbildes gesetzt
  canvas.width = previewImg.naturalWidth;
  canvas.height = previewImg.naturalHeight;

  // Die vom Anwender geänderten Werte werden auf das "canvas" Bild angewendet
  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  if(rotate !== 0) {
    ctx.rotate(rotate * Math.PI / 180);
  }
  ctx.scale(flipHorizontal, flipVertical);
  ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

  // Es wird ein Hyprerlink für das Bild erstellt
  const link = document.createElement("a");
  // Für den Download wird ein Standard Name vergeben
  link.download = "bild.jpg";
  // Das "canvas" Element wird an den Hyperlink
  link.href = canvas.toDataURL();
  // Der Hyperlink wird betätigt damit der Download automatisch beginnt
  link.click();
  //document.body.appendChild(canvas);
}

fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
resetBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImg);
chooseImgBtn.addEventListener("click", () => fileInput.click());
