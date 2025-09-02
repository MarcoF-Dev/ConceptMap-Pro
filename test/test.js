const drawingSection = document.getElementById("drawSection");
const sidebarIcon = document.querySelectorAll(".sidebarIcon");
let activeIconId = "addIcon"; // Inizialmente attiva l'icona add

// Gestione click delle icone della sidebar
sidebarIcon.forEach((icon) => {
  icon.addEventListener("click", (e) => {
    // Rimuovi la classe active da tutte le icone
    sidebarIcon.forEach((icon) => {
      icon.classList.remove("active");
    });

    // Aggiungi la classe active solo all'icona cliccata
    e.currentTarget.classList.add("active");

    // Aggiorna l'ID dell'icona attiva
    activeIconId = e.currentTarget.id;

    // Aggiorna la modalità delle forme esistenti
    updateExistingShapesMode();
  });
});

// Funzione per aggiornare la modalità di tutte le forme esistenti
function updateExistingShapesMode() {
  const allShapes = drawingSection.querySelectorAll(
    '.box, .rectangle, .circle, .long-arrow-link, [contenteditable="true"]'
  );

  allShapes.forEach((shape) => {
    // Rimuovi tutti gli event listener esistenti per il drag
    if (shape._dragHandler) {
      shape.removeEventListener("mousedown", shape._dragHandler);
      document.removeEventListener("mousemove", shape._moveHandler);
      document.removeEventListener("mouseup", shape._upHandler);
      delete shape._dragHandler;
      delete shape._moveHandler;
      delete shape._upHandler;
    }

    // Rimuovi event listener per il click se esistono
    if (shape._clickHandler) {
      shape.removeEventListener("click", shape._clickHandler);
      delete shape._clickHandler;
    }

    if (activeIconId === "dragIcon") {
      // Aggiungi drag and drop
      makeDraggable(shape);
    } else if (activeIconId === "cursorIcon") {
      // Aggiungi click per mostrare controlli
      const clickHandler = (e) => {
        if (shape.classList.contains("long-arrow-link")) {
          showArrowControls(shape, e);
        } else if (shape.hasAttribute("contenteditable")) {
          showTextControls(shape, e);
        } else {
          showShapeControls(shape, e);
        }
      };

      shape._clickHandler = clickHandler;
      shape.addEventListener("click", clickHandler);
    }
  });
}

// Funzione per creare forme direttamente
function createShape(shapeType, x, y) {
  const div = document.createElement("div");

  if (shapeType === "box") {
    div.classList.add("box");
  } else if (shapeType === "rectangle") {
    div.classList.add("rectangle");
  } else if (shapeType === "circle") {
    div.classList.add("circle");
  }

  div.style.left = `${x}px`;
  div.style.top = `${y}px`;
  div.style.transform = "translate(-50%, -50%)";
  drawingSection.appendChild(div);

  // Rendi sempre trascinabile
  makeDraggable(div);

  // Aggiungi event listener per il click per mostrare sempre i controlli
  div.addEventListener("click", (e) => {
    showShapeControls(div, e);
  });
}

// Funzione per mostrare i controlli delle forme
function showShapeControls(div, e) {
  // Se i controlli sono già visibili, nascondili
  if (div.querySelector(".delete-btn")) {
    const existingControls = div.querySelectorAll(
      ".delete-btn, .box-icon, .rectangle-icon, .circle-icon, .text-icon, .plus-icon, .minus-icon"
    );
    existingControls.forEach((control) => control.remove());
    return;
  }

  if (div.classList.contains("box")) {
    // Icona per trasformare in rettangolo
    const rectangleIcon = document.createElement("span");
    rectangleIcon.innerHTML = `<i class="ri-rectangle-line"></i>`;
    rectangleIcon.classList.add("rectangle-icon");
    div.appendChild(rectangleIcon);

    rectangleIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      div.classList.remove("box");
      div.classList.add("rectangle");
      showShapeControls(div, e);
    });

    // Icona per trasformare in cerchio
    const circleIcon = document.createElement("span");
    circleIcon.innerHTML = `<i class="ri-circle-line"></i>`;
    circleIcon.classList.add("circle-icon");
    div.appendChild(circleIcon);

    circleIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      div.classList.remove("box");
      div.classList.add("circle");
      showShapeControls(div, e);
    });

    // Icona per aggiungere testo
    const textIcon = document.createElement("span");
    textIcon.innerHTML = `<i class="ri-text"></i>`;
    textIcon.classList.add("text-icon");
    div.appendChild(textIcon);

    textIcon.addEventListener("click", (e) => {
      if (div.querySelector(".shape-text")) {
        div.querySelector(".shape-text").remove();
        return;
      }
      e.stopPropagation();
      addTextToShape(div);
    });
  } else if (div.classList.contains("rectangle")) {
    // Icona per trasformare in quadrato
    const boxIcon = document.createElement("span");
    boxIcon.innerHTML = `<i class="ri-square-line"></i>`;
    boxIcon.classList.add("box-icon");
    div.appendChild(boxIcon);

    boxIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      div.classList.remove("rectangle");
      div.classList.add("box");
      showShapeControls(div, e);
    });

    // Icona per trasformare in cerchio
    const circleIcon = document.createElement("span");
    circleIcon.innerHTML = `<i class="ri-circle-line"></i>`;
    circleIcon.classList.add("circle-icon");
    div.appendChild(circleIcon);

    circleIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      div.classList.remove("rectangle");
      div.classList.add("circle");
      showShapeControls(div, e);
    });

    // Icona per aggiungere testo
    const textIcon = document.createElement("span");
    textIcon.innerHTML = `<i class="ri-text"></i>`;
    textIcon.classList.add("text-icon");
    div.appendChild(textIcon);

    textIcon.addEventListener("click", (e) => {
      if (div.querySelector(".shape-text")) {
        div.querySelector(".shape-text").remove();
        return;
      }
      e.stopPropagation();
      addTextToShape(div);
    });
  } else if (div.classList.contains("circle")) {
    // Icona per trasformare in quadrato
    const boxIcon = document.createElement("span");
    boxIcon.innerHTML = `<i class="ri-square-line"></i>`;
    boxIcon.classList.add("box-icon");
    div.appendChild(boxIcon);

    boxIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      div.classList.remove("circle");
      div.classList.add("box");
      showShapeControls(div, e);
    });

    // Icona per trasformare in rettangolo
    const rectangleIcon = document.createElement("span");
    rectangleIcon.innerHTML = `<i class="ri-rectangle-line"></i>`;
    rectangleIcon.classList.add("rectangle-icon");
    rectangleIcon.style.left = "-1.875rem";
    div.appendChild(rectangleIcon);

    rectangleIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      div.classList.remove("circle");
      div.classList.add("rectangle");
      showShapeControls(div, e);
    });

    // Icona per aggiungere testo
    const textIcon = document.createElement("span");
    textIcon.innerHTML = `<i class="ri-text"></i>`;
    textIcon.classList.add("text-icon");
    div.appendChild(textIcon);

    textIcon.addEventListener("click", (e) => {
      if (div.querySelector(".shape-text")) {
        div.querySelector(".shape-text").remove();
        return;
      }
      e.stopPropagation();
      addTextToShape(div);
    });
  }

  // Pulsante elimina per tutte le forme
  const deleteBtn = document.createElement("span");
  deleteBtn.innerHTML = `<i class="ri-delete-bin-line"></i>`;
  deleteBtn.classList.add("delete-btn");
  div.appendChild(deleteBtn);

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    div.remove();
  });

  const plusIcon = document.createElement("span");
  plusIcon.innerHTML = `<i class="ri-add-line"></i>`;
  plusIcon.classList.add("plus-icon");
  div.appendChild(plusIcon);

  plusIcon.addEventListener("click", (e) => {
    // Logica per aggiungere una nuova forma
    let currentHeight = parseInt(window.getComputedStyle(div).height);
    let currentWidth = parseInt(window.getComputedStyle(div).width);

    // Aggiungo 10px
    div.style.height = currentHeight + 10 + "px";
    div.style.width = currentWidth + 10 + "px";
  });

  const minusIcon = document.createElement("span");
  minusIcon.innerHTML = `<i class="ri-subtract-line"></i>`;
  minusIcon.classList.add("minus-icon");
  div.appendChild(minusIcon);

  minusIcon.addEventListener("click", (e) => {
    let currentHeight = parseInt(window.getComputedStyle(div).height);
    let currentWidth = parseInt(window.getComputedStyle(div).width);

    // Sottraggo 10px (con un limite minimo di 20px per evitare scomparsa)
    div.style.height = Math.max(currentHeight - 10, 20) + "px";
    div.style.width = Math.max(currentWidth - 10, 20) + "px";
    // Logica per rimuovere una forma
  });
}

// Funzione per aggiungere testo a una forma
function addTextToShape(div) {
  // Rimuovi controlli esistenti
  if (div.querySelector(".shape-text")) {
    const existingControls = div.querySelectorAll(
      ".delete-btn, .box-icon, .rectangle-icon, .circle-icon, .text-icon, .plus-icon, .minus-icon"
    );
    existingControls.forEach((control) => control.remove());

    return;
  }

  // Crea elemento di testo
  const textElement = document.createElement("textarea");
  textElement.classList.add("shape-text");
  textElement.placeholder = "Scrivi qui...";
  textElement.value = "";

  div.appendChild(textElement);

  // Auto-resize del testo
  textElement.addEventListener("input", function () {
    textElement.style.height = "auto";

    textElement.style.height = textElement.scrollHeight + "px";
  });

  // Focus sul testo
  textElement.focus();

  // Aggiungi pulsante elimina
  const deleteBtn = document.createElement("span");
  deleteBtn.innerHTML = `<i class="ri-delete-bin-line"></i>`;
  deleteBtn.classList.add("delete-btn");
  div.appendChild(deleteBtn);

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    div.remove();
  });
}

// Funzione per rendere un elemento trascinabile
function makeDraggable(div) {
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;

  div.addEventListener("mousedown", (e) => {
    if (activeIconId === "dragIcon") {
      isDragging = true;
      offsetX = e.clientX - div.offsetLeft;
      offsetY = e.clientY - div.offsetTop;
      div.style.cursor = "grabbing";
    }
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging || activeIconId !== "dragIcon") {
      return;
    }
    div.style.left = `${e.clientX - offsetX}px`;
    div.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      div.style.cursor = "grab";
    }
  });
}

// Gestione del click principale
document.addEventListener("mousedown", (event) => {
  // Solo se addIcon è attiva, mostra le icone temporanee
  if (activeIconId === "addIcon") {
    if (event.target === drawingSection) {
      const x = event.clientX;
      const y = event.clientY;

      const lineIcon = document.createElement("span");
      lineIcon.innerHTML = `<i class="ri-arrow-right-line"></i>`;
      lineIcon.classList.add("line-icon");
      drawingSection.appendChild(lineIcon);
      lineIcon.style.left = `${x}px`;
      lineIcon.style.top = `${y}px`;
      lineIcon.style.position = "absolute";

      const form = document.createElement("div");
      form.classList.add("form-icon");
      form.innerHTML = `<i class="ri-square-line"></i>`;
      drawingSection.appendChild(form);
      form.style.left = `calc(${x}px + 50px)`;
      form.style.top = `${y}px`;
      form.style.position = "absolute";

      lineIcon.addEventListener("click", (e) => {
        const newX = event.clientX;
        const newY = event.clientY;
        e.stopPropagation();
        lineIcon.remove();
        form.remove();
        createArrow(newX, newY);
      });

      form.addEventListener("click", (e) => {
        const newX = e.clientX;
        const newY = e.clientY;
        form.remove();
        lineIcon.remove();
        createShape("box", newX, newY);
      });
    }
  }
});

// Gestione del click per creazione diretta delle forme
document.addEventListener("mousedown", (event) => {
  if (event.target === drawingSection) {
    const x = event.clientX;
    const y = event.clientY;

    if (activeIconId === "squareIcon") {
      createShape("box", x, y);
    } else if (activeIconId === "rectangleIcon") {
      createShape("rectangle", x, y);
    } else if (activeIconId === "circleIcon") {
      createShape("circle", x, y);
    } else if (activeIconId === "arrowIcon") {
      // Creazione diretta della freccia
      createArrow(x, y);
    } else if (activeIconId === "textIcon") {
      // Creazione diretta del testo
      createTextElement(x, y);
    } else if (activeIconId === "cornerIconRight") {
      // Creazione curva destra
      createCornerCurve(x, y, "right");
    } else if (activeIconId === "cornerIconLeft") {
      // Creazione curva sinistra
      createCornerCurve(x, y, "left");
    }
  }
});

let initialRotation = 0;
// Funzione per mostrare i controlli delle frecce
function showArrowControls(lineArrow, e) {
  console.log("Mostra controlli freccia");
  // Rimuovi controlli esistenti

  const existingControls = lineArrow.querySelectorAll(
    ".color-input, .arrowTrash-Icon, .turn-icon"
  );
  if (existingControls.length > 0) {
    existingControls.forEach((control) => control.remove());
    return;
  }

  // Aggiungi color picker
  const colorInput = document.createElement("input");
  colorInput.type = "color";
  colorInput.value = "#000000";
  lineArrow.appendChild(colorInput);
  colorInput.classList.add("color-input");

  colorInput.addEventListener("change", (e) => {
    const newcolor = e.target.value;
    const svg = lineArrow.querySelector("svg");
    if (svg) {
      const line = svg.querySelector("line");
      const polygon = svg.querySelector("polygon");
      if (line) line.setAttribute("stroke", newcolor);
      if (polygon) polygon.setAttribute("fill", newcolor);
    }
  });

  // Aggiungi icona cestino
  const trashIcon = document.createElement("span");
  trashIcon.innerHTML = `<i class="ri-delete-bin-line"></i>`;
  trashIcon.classList.add("arrowTrash-Icon");
  lineArrow.appendChild(trashIcon);

  trashIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    lineArrow.remove();
  });

  // Aggiungi icona rotazione sinistra
  const turnLeft = document.createElement("span");
  turnLeft.innerHTML = `<i class="ri-corner-left-down-fill"></i>`;
  lineArrow.appendChild(turnLeft);
  turnLeft.classList.add("turn-icon");
  turnLeft.classList.add("turn-left");

  // Aggiungi icona rotazione destra
  const turnRight = document.createElement("span");
  turnRight.innerHTML = `<i class="ri-corner-right-down-fill"></i>`;
  lineArrow.appendChild(turnRight);
  turnRight.classList.add("turn-icon");
  turnRight.classList.add("turn-right");

  let rotation = initialRotation;
  let rotateInterval = null;

  turnLeft.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    // Ruota di -2 gradi ogni 20ms
    rotateInterval = setInterval(() => {
      rotation -= 2;
      const svg = lineArrow.querySelector("svg");
      if (svg) {
        svg.style.transform = `rotate(${rotation}deg)`;
        svg.style.transformOrigin = "0, 50%";
      }
    }, 20);
  });

  turnLeft.addEventListener("mouseup", (e) => {
    clearInterval(rotateInterval);
  });

  turnLeft.addEventListener("mouseleave", (e) => {
    clearInterval(rotateInterval);
    initialRotation = rotation;
  });

  turnRight.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    rotateInterval = setInterval(() => {
      rotation += 2;
      const svg = lineArrow.querySelector("svg");
      if (svg) {
        svg.style.transform = `rotate(${rotation}deg)`;
        svg.style.transformOrigin = "0, 50%";
      }
    }, 20);
  });

  turnRight.addEventListener("mouseup", (e) => {
    clearInterval(rotateInterval);
  });

  turnRight.addEventListener("mouseleave", (e) => {
    clearInterval(rotateInterval);
    initialRotation = rotation;
  });
}

// Funzione per creare elementi di testo
function createTextElement(x, y) {
  const textDiv = document.createElement("div");
  textDiv.contentEditable = true;
  textDiv.textContent = "Testo";
  textDiv.style.position = "absolute";
  textDiv.style.left = `${x}px`;
  textDiv.style.top = `${y}px`;
  textDiv.style.transform = "translate(-50%, -50%)";
  textDiv.style.minWidth = "100px";
  textDiv.style.padding = "8px";
  textDiv.style.border = "2px solid #333";
  textDiv.style.borderRadius = "6px";
  textDiv.style.backgroundColor = "#fff";
  textDiv.style.fontSize = "16px";
  textDiv.style.fontFamily = "Arial, sans-serif";
  textDiv.style.cursor = "text";
  textDiv.style.zIndex = "100";

  drawingSection.appendChild(textDiv);

  // Focus sul testo per permettere la modifica immediata
  textDiv.focus();

  // Aggiungi event listener per il click (solo in modalità cursor)
  textDiv.addEventListener("click", (e) => {
    if (activeIconId === "cursorIcon") {
      e.stopPropagation();
      showTextControls(textDiv, e);
    }
  });

  // Aggiungi drag and drop se è attiva l'icona drag
  if (activeIconId === "dragIcon") {
    makeDraggable(textDiv);
  }
}

// Funzione per mostrare i controlli del testo
function showTextControls(textDiv, e) {
  // Rimuovi controlli esistenti
  const existingControls = textDiv.querySelectorAll(".delete-btn");
  existingControls.forEach((control) => control.remove());

  const deleteBtn = document.createElement("span");
  deleteBtn.innerHTML = `<i class="ri-delete-bin-line"></i>`;
  deleteBtn.classList.add("delete-btn");
  deleteBtn.style.top = "-50px";
  deleteBtn.style.right = "-20px";
  textDiv.appendChild(deleteBtn);

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    textDiv.remove();
  });
}

// Funzione per creare frecce
function createArrow(x, y) {
  const lineArrow = document.createElement("div");
  let color = "#000";

  function changeArrow(colorArrow) {
    lineArrow.innerHTML = `
      <svg width="120" height="20" viewBox="0 0 120 20" xmlns="http://www.w3.org/2000/svg">
        <!-- Corpo della freccia -->
        <line x1="0" y1="10" x2="100" y2="10" stroke="${colorArrow}" stroke-width="3" />
        <!-- Punta della freccia -->
        <polygon points="100,0 120,10 100,20" fill="${colorArrow}" />
      </svg>`;
  }

  changeArrow(color);
  lineArrow.classList.add("long-arrow-link");
  drawingSection.appendChild(lineArrow);
  lineArrow.style.left = `${x}px`;
  lineArrow.style.top = `${y}px`;
  lineArrow.style.position = "absolute";

  // Rendi sempre trascinabile
  makeDraggable(lineArrow);

  // Aggiungi event listener per il click
  lineArrow.addEventListener("click", (e) => {
    showArrowControls(lineArrow, e);
  });
}

// Funzione per creare curve angolari
function createCornerCurve(x, y, direction) {
  const curveDiv = document.createElement("div");
  curveDiv.style.position = "absolute";
  curveDiv.style.left = `${x}px`;
  curveDiv.style.top = `${y}px`;
  curveDiv.style.transform = "translate(-50%, -50%)";
  curveDiv.style.width = "80px";
  curveDiv.style.height = "80px";

  // Crea SVG per la curva
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "80");
  svg.setAttribute("height", "80");
  svg.setAttribute("viewBox", "0 0 80 80");

  let path;
  if (direction === "right") {
    path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M 10 10 L 70 10 L 70 70");
    path.setAttribute("stroke", "#333");
    path.setAttribute("stroke-width", "3");
    path.setAttribute("fill", "none");
  } else {
    path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M 70 10 L 10 10 L 10 70");
    path.setAttribute("stroke", "#333");
    path.setAttribute("stroke-width", "3");
    path.setAttribute("fill", "none");
  }

  svg.appendChild(path);
  curveDiv.appendChild(svg);

  drawingSection.appendChild(curveDiv);

  // Rendi sempre trascinabile
  makeDraggable(curveDiv);

  // Aggiungi event listener per il click
  curveDiv.addEventListener("click", (e) => {
    showCurveControls(curveDiv, e);
  });
}

// Funzione per mostrare i controlli delle curve
function showCurveControls(curveDiv, e) {
  // Rimuovi controlli esistenti
  const existingControls = curveDiv.querySelectorAll(".delete-btn");
  existingControls.forEach((control) => control.remove());

  const deleteBtn = document.createElement("span");
  deleteBtn.innerHTML = `<i class="ri-delete-bin-line"></i>`;
  deleteBtn.classList.add("delete-btn");
  deleteBtn.style.top = "-50px";
  deleteBtn.style.right = "-20px";
  curveDiv.appendChild(deleteBtn);

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    curveDiv.remove();
  });
}
