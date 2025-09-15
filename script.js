/********************************************************************
 *                       EMAIL SPAN ID            *
 ********************************************************************/
document.getElementById("copyEmail").addEventListener("click", () => {
  navigator.clipboard
    .writeText("marcofavara.dev@gmail.com")
    .then(() => {
      Toastify({
        text: "Email copiata negli appunti!",
        duration: 3000,
        close: true,
        gravity: "top", // top o bottom
        position: "center", // left, center, right
        backgroundColor: "#2563eb",
        stopOnFocus: true, // ferma il timeout se il mouse è sopra
      }).showToast();
    })
    .catch(() => {
      Toastify({
        text: "Copia non riuscita",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#e02424",
        stopOnFocus: true,
      }).showToast();
    });
});
/********************************************************************
 *                       CHANGE SECTION WITH BTN                *
 ********************************************************************/
manualBtn = document.getElementById("manualBtn");

const homeBtn = document.getElementById("returnHome");

const magicBtn = document.getElementById("magicBtn");

function showSection(sectionId) {
  const allSection = document.querySelectorAll(".pageSection");

  allSection.forEach((section) => {
    section.classList.remove("active");
  });
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add("active");
  }
}

magicBtn.addEventListener("click", () => {
  showSection("magicMapPage");
});
manualBtn.addEventListener("click", () => {
  showSection("manualMapPage");
  cleanDrawingSection();
});
homeBtn.addEventListener("click", () => {
  showSection("mainPage");
});

/********************************************************************
 *                      MANUAL DRAWING SECTION AND ICONS             *
 ********************************************************************/
const drawingSection = document.getElementById("drawSection");
function cleanDrawingSection() {
  drawingSection.innerHTML = `<svg
          id="connections"
          style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
          "
        ></svg>`;
  fastMapCard.classList.remove("compare");
  drawingSection.style.cursor = "default";
}

const sidebarIcon = document.querySelectorAll(".sidebarIcon");
const uploadIcon = document.getElementById("uploadIcon");
// Screen in png di drawingSection
uploadIcon.addEventListener("click", () => {
  const textareas = drawingSection.querySelectorAll("textarea");
  const tempDivs = [];

  textareas.forEach((ta) => {
    const tempDiv = document.createElement("div");
    tempDiv.textContent = ta.value;

    // copia gli stili principali
    const style = getComputedStyle(ta);
    tempDiv.style.width = style.width;
    tempDiv.style.height = style.height;
    tempDiv.style.font = style.font;
    tempDiv.style.padding = style.padding;
    tempDiv.style.margin = style.margin;
    tempDiv.style.whiteSpace = "pre-wrap";
    tempDiv.style.wordBreak = "break-word";
    tempDiv.style.background = "transparent";

    tempDiv.style.display = "flex";
    tempDiv.style.alignItems = "center"; // verticale
    tempDiv.style.justifyContent = "center"; // orizzontale
    tempDiv.style.textAlign = style.textAlign;

    ta.style.display = "none";
    ta.parentElement.appendChild(tempDiv);
    tempDivs.push({ tempDiv, textarea: ta });
  });
  html2canvas(drawingSection).then((canvas) => {
    const link = document.createElement("a");
    link.download = "screenshot.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  tempDivs.forEach(({ tempDiv, textarea }) => {
    tempDiv.remove();
    textarea.style.display = "block";
  });
});
let activeIconId = "squareIcon"; // Inizialmente attiva l'icona add

let selectedShapeA = null;
let selectedShapeB = null;

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

    if (activeIconId === "linkIcon") {
      Toastify({
        text: "Selects 2 shapes to connect them",
        duration: 2500,
        gravity: "top", // top o bottom
        position: "left", // left, center, right
        style: {
          background: "linear-gradient(90deg, #60a5fa 0%, #9d4edd 100%)",
          fontFamily: "'Poppins', sans-serif",
        },
      }).showToast();
    } else if (activeIconId === "dragIcon") {
      drawingSection.style.cursor = "grab";
      Toastify({
        text: "click on a shape to grab it",
        duration: 2500,
        gravity: "top", // top o bottom
        position: "left", // left, center, right
        style: {
          background: "linear-gradient(90deg, #60a5fa 0%, #9d4edd 100%)",
          fontFamily: "'Poppins', sans-serif",
        },
      }).showToast();
    } else if (activeIconId === "trashIcon") {
      cleanDrawingSection();
    } else {
      drawingSection.style.cursor = "";
    }
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
/********************************************************************
 *                       CREATING SHAPES FOR MANUAL SECTION                *
 ********************************************************************/
// Funzione per creare forme direttamente
function createShape(shapeType, x, y) {
  const div = document.createElement("div");
  div.classList.add("shape");

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
    if (
      !e.target.closest(".minus-icon") &&
      !e.target.closest(".plus-icon") &&
      activeIconId !== "linkIcon" &&
      activeIconId !== "dragIcon"
    ) {
      console.log(e.target);
      showShapeControls(div, e);
    }
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
      div.style.height = "100px";
      div.style.width = "150px";
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
      div.style.height = "100px";
      div.style.width = "100px";
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
      div.style.height = "100px";
      div.style.width = "100px";
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
      div.style.height = "100px";
      div.style.width = "100px";
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
      div.style.height = "100px";
      div.style.width = "100px";
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
      div.style.height = "100px";
      div.style.width = "150px";
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
    deleteLine(div);
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
    updateConnectionsForShape(div);
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
    updateConnectionsForShape(div);
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

  // Focus sul testo
  textElement.focus();
}

/********************************************************************
 *                      DRAGGABLE SHAPES           *
 ********************************************************************/

let draggingShape = null;
let offsetX = 0;
let offsetY = 0;

function makeDraggable(shape) {
  shape.addEventListener("mousedown", (e) => {
    if (activeIconId !== "dragIcon") {
      shape.style.cursor = "pointer";
      return;
    }
    shape.style.cursor = "grabbing";

    draggingShape = shape;
    offsetX = e.clientX - shape.offsetLeft;
    offsetY = e.clientY - shape.offsetTop;

    let moved = false;

    const mouseMoveHandler = (eMove) => {
      moved = true;
      shape.style.left = `${eMove.clientX - offsetX}px`;
      shape.style.top = `${eMove.clientY - offsetY}px`;
      updateConnectionsForShape(draggingShape);
    };

    const mouseUpHandler = () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    };

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);

    e.stopPropagation();
  });
}

// Gestione del click principale

// Gestione del click per creazione diretta delle forme
document.addEventListener("mousedown", (event) => {
  if (event.target === drawingSection && event.button === 0) {
    let x = event.clientX;
    let y = event.clientY;

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
    }
  }
  if (
    event.target.classList.contains("shape") ||
    event.target.classList.contains("text-div")
  ) {
    if (activeIconId === "linkIcon") {
      if (event.target == selectedShapeA) {
        event.target.classList.remove("selectedShape");
        selectedShapeA = null;
        return;
      }
      if (event.target == selectedShapeB) {
        event.target.classList.remove("selectedShape");
        selectedShapeB = null;
        return;
      }
      if (!selectedShapeA) {
        // Primo click -> selezione A
        selectedShapeA = event.target;
        selectedShapeA.classList.add("selectedShape");
      } else if (!selectedShapeB && event.target !== selectedShapeA) {
        // Secondo click -> selezione B
        selectedShapeB = event.target;
        selectedShapeB.classList.add("selectedShape");

        // Collega
        connectShapes(selectedShapeA, selectedShapeB);

        // Reset
        selectedShapeA.classList.remove("selectedShape");
        selectedShapeB.classList.remove("selectedShape");
        selectedShapeA = null;
        selectedShapeB = null;
      }
    }
  } else if (event.target.tagName === "TEXTAREA") {
    // Se clicchi sulla textarea, seleziona il padre (la forma)
    const parent = event.target.parentElement;
    if (activeIconId === "linkIcon" && parent) {
      if (!selectedShapeA) {
        selectedShapeA = parent;
        selectedShapeA.classList.add("selectedShape");
      } else if (!selectedShapeB && parent !== selectedShapeA) {
        selectedShapeB = parent;
        selectedShapeB.classList.add("selectedShape");
        connectShapes(selectedShapeA, selectedShapeB);
        selectedShapeA.classList.remove("selectedShape");
        selectedShapeB.classList.remove("selectedShape");
        selectedShapeA = null;
        selectedShapeB = null;
      }
    }
  }
});

/********************************************************************
 *                   ARROWS CREATION AND CONTROLS             *
 ********************************************************************/
function showArrowControls(lineArrow, e) {
  // Rimuovi controlli esistenti

  const existingControls = lineArrow.querySelectorAll(
    ".color-input, .arrowTrash-Icon, .turn-icon"
  );
  if (existingControls.length > 0) {
    existingControls.forEach((control) => control.remove());
    return;
  }

  if (lineArrow.rotation === undefined) {
    lineArrow.rotation = 0;
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

  let rotateInterval = null;

  turnLeft.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    // Ruota di -2 gradi ogni 20ms
    rotateInterval = setInterval(() => {
      lineArrow.rotation -= 2;
      const svg = lineArrow.querySelector("svg");
      if (svg) {
        svg.style.transform = `rotate(${lineArrow.rotation}deg)`;
        svg.style.transformOrigin = "50%, 50%";
      }
    }, 20);
  });

  turnRight.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    rotateInterval = setInterval(() => {
      lineArrow.rotation += 2;
      const svg = lineArrow.querySelector("svg");
      if (svg) {
        svg.style.transform = `rotate(${lineArrow.rotation}deg)`;
        svg.style.transformOrigin = "50%, 50%";
      }
    }, 20);
  });

  const stopRotation = () => clearInterval(rotateInterval);
  turnLeft.addEventListener("mouseup", stopRotation);
  turnLeft.addEventListener("mouseleave", stopRotation);
  turnRight.addEventListener("mouseup", stopRotation);
  turnRight.addEventListener("mouseleave", stopRotation);
}

// Funzione per creare elementi di testo
function createTextElement(x, y) {
  const textDiv = document.createElement("div");
  textDiv.contentEditable = true;
  textDiv.textContent = "Testo";
  textDiv.t = "Testo";
  textDiv.style.position = "absolute";
  textDiv.style.left = `${x}px`;
  textDiv.style.top = `${y}px`;
  textDiv.style.transform = "translate(-50%, -50%)";

  textDiv.classList.add("text-div");

  drawingSection.appendChild(textDiv);

  // Focus sul testo per permettere la modifica immediata
  textDiv.focus();

  // Aggiungi event listener per il click (solo in modalità cursor)
  textDiv.addEventListener("click", (e) => {
    if (activeIconId !== "linkIcon" && activeIconId !== "dragIcon") {
      showTextControls(textDiv, e);
      e.stopPropagation();
    } else return;
  });

  // Aggiungi drag and drop se è attiva l'icona drag
  if (activeIconId === "dragIcon") {
    makeDraggable(textDiv);
  }
}

// Funzione per mostrare i controlli del testo
function showTextControls(textDiv) {
  // Rimuovi controlli esistenti
  if (textDiv.querySelector(".delete-btn")) {
    const existingControls = textDiv.querySelectorAll(".delete-btn");
    existingControls.forEach((control) => control.remove());
    return;
  }

  const deleteBtn = document.createElement("span");
  deleteBtn.innerHTML = `<i class="ri-delete-bin-line"></i>`;
  deleteBtn.classList.add("delete-btn");
  deleteBtn.contentEditable = false;
  deleteBtn.style.top = "-50px";
  deleteBtn.style.right = "-20px";
  textDiv.appendChild(deleteBtn);

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    textDiv.remove();
    deleteLine(textDiv);
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
    if (!e.target.closest(".turn-right") && !e.target.closest(".turn-left")) {
      showArrowControls(lineArrow, e);
    }
  });
}
/********************************************************************
 *                     LINK CREATION AND POSITION CHECKING              *
 ********************************************************************/
const connections = []; // Array di collegamenti {from, to, line}
function deleteLine(div) {
  connections
    .filter((conn) => conn.from === div || conn.to === div)
    .forEach((conn) => {
      if (conn.line && conn.line.parentNode) {
        conn.line.parentNode.removeChild(conn.line);
      }
    });

  // Rimuovi le connessioni dall'array
  for (let i = connections.length - 1; i >= 0; i--) {
    if (connections[i].from === div || connections[i].to === div) {
      connections.splice(i, 1);
    }
  }

  // Reset selezione se necessario
  if (selectedShapeA === div) selectedShapeA = null;
  if (selectedShapeB === div) selectedShapeB = null;
}
function connectShapes(divA, divB) {
  if (!divA.parentNode || !divB.parentNode) return;
  const svg = document.getElementById("connections");

  // Crea una linea
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("stroke", "black");
  line.setAttribute("stroke-width", "2");
  svg.appendChild(line);

  // Salva connessione
  connections.push({ from: divA, to: divB, line });

  // Aggiorna subito la posizione
  updateLine(divA, divB, line);
  divA.classList.remove("selectedShape");
  divB.classList.remove("selectedShape");
}

// Aggiorna la posizione di una linea
function updateLine(divA, divB, line) {
  const rectA = divA.getBoundingClientRect();
  const rectB = divB.getBoundingClientRect();

  const x2 = rectB.left + rectB.width / 2;
  const y2 = rectB.top + rectB.height / 2;
  const x1 = rectA.left + rectA.width / 2;
  const y1 = rectA.top + rectA.height / 2;

  // Punto sul bordo di A
  let pointA;
  if (divA.classList.contains("circle")) {
    pointA = getCircleIntersection(rectA, x2, y2);
  } else {
    pointA = getIntersectionPoint(rectA, x2, y2);
  }

  // Punto sul bordo di B
  let pointB;
  if (divB.classList.contains("circle")) {
    pointB = getCircleIntersection(rectB, x1, y1);
  } else {
    pointB = getIntersectionPoint(rectB, x1, y1);
  }

  // Aggiorna linea
  line.setAttribute("x1", pointA.x);
  line.setAttribute("y1", pointA.y);
  line.setAttribute("x2", pointB.x);
  line.setAttribute("y2", pointB.y);
}

// Funzione per calcolare intersezione con il cerchio
function getCircleIntersection(rect, targetX, targetY) {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const r = rect.width / 2; // assumendo cerchio perfetto (width = height)

  const dx = targetX - cx;
  const dy = targetY - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  return {
    x: cx + (dx / dist) * r,
    y: cy + (dy / dist) * r,
  };
}

function getIntersectionPoint(rect, targetX, targetY) {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const dx = targetX - cx;
  const dy = targetY - cy;

  // Rapporto necessario per uscire dal rettangolo
  const scaleX = dx !== 0 ? rect.width / 2 / Math.abs(dx) : Infinity;
  const scaleY = dy !== 0 ? rect.height / 2 / Math.abs(dy) : Infinity;

  const scale = Math.min(scaleX, scaleY);

  return {
    x: cx + dx * scale,
    y: cy + dy * scale,
  };
}

// Quando sposti una forma, aggiorna le linee collegate
function updateConnectionsForShape(div) {
  connections.forEach((conn) => {
    if (conn.from === div || conn.to === div) {
      updateLine(conn.from, conn.to, conn.line);
    }
  });
}

/********************************************************************
 *                     FAST MAP TO CREATE MORE SHAPES               *
 ********************************************************************/
const fastBtn = document.getElementById("fastMap");

const fastMapCard = document.getElementById("fastMapCard");
const closeFastMapBtn = document.getElementById("closeFastMap");
const confirmFastMapBtn = document.getElementById("confirmFastMap");

fastBtn.addEventListener("click", () => {
  fastMapCard.classList.contains("compare")
    ? fastMapCard.classList.remove("compare")
    : fastMapCard.classList.add("compare");
});

closeFastMapBtn.addEventListener("click", () => {
  fastMapCard.classList.remove("compare");
});

confirmFastMapBtn.addEventListener("click", () => {
  const numInput = document.querySelectorAll(".numInput");
  fastMapCard.classList.remove("compare");
  let numBoxes = parseInt(document.getElementById("numBoxes").value) || 0;
  let numRectangles =
    parseInt(document.getElementById("numRectangles").value) || 0;
  let numCircles = parseInt(document.getElementById("numCircles").value) || 0;

  if (numBoxes > 12) {
    numBoxes = 12;
    Toastify({
      text: "Max squares number: 12",
      duration: 2500,
      gravity: "top", // top o bottom
      position: "left", // left, center, right
      style: {
        background: "red",
        fontFamily: "'Poppins', sans-serif",
      },
    }).showToast();
  }
  if (numRectangles > 9) {
    numRectangles = 9;
    Toastify({
      text: "Max rectangles number: 9",
      duration: 2500,
      gravity: "top", // top o bottom
      position: "left", // left, center, right
      style: {
        background: "red",
        fontFamily: "'Poppins', sans-serif",
      },
    }).showToast();
  }
  if (numCircles > 12) {
    numCircles = 9;
    Toastify({
      text: "Max circles number: 9",
      duration: 2500,
      gravity: "top", // top o bottom
      position: "left", // left, center, right
      style: {
        background: "red",
        fontFamily: "'Poppins', sans-serif",
      },
    }).showToast();
  }
  const xStart = 200;
  let yStart = 200;

  for (let i = 0; i < numBoxes; i++) {
    createShape("box", xStart + i * 120, yStart);
  }
  yStart += 150;
  for (let i = 0; i < numRectangles; i++) {
    createShape("rectangle", xStart + i * 170, yStart);
  }
  yStart += 150;
  for (let i = 0; i < numCircles; i++) {
    createShape("circle", xStart + i * 120, yStart);
  }

  numInput.forEach((input) => {
    input.value = 1;
  });
});

// MAGIC MAP
/********************************************************************
 *                     MAGIC MAP SECTION               *
 ********************************************************************/
const magicBtnHome = document.getElementById("magicBtnHome");
const textarea = document.getElementById("magicText");
magicBtnHome.addEventListener("click", () => {
  showSection("mainPage");

  textarea.value = "";
});

//Create magic map

const createMagicBtn = document.getElementById("magicCardBtn");
createMagicBtn.addEventListener("click", () => {
  checkCard();
});

const loadingText = document.getElementById("logger");
let messages = [
  "Analyzing the text...",
  "Extracting the main concepts...",
  "Creating the connections...",
  "Generating the map...",
];

let msgIndex = 0;
let intervalId;

function checkCard() {
  function createToast(text, color) {
    Toastify({
      text: text,
      duration: 2500,
      gravity: "top", // top o bottom
      position: "left", // left, center, right
      style: {
        background: color,
        fontFamily: "'Poppins', sans-serif",
      },
    }).showToast();
  }

  const textValue = textarea.value.trim();

  if (!textValue) {
    createToast("Insert text", "red");
    return;
  }

  sendToGemini(textValue, "radiale");
}
/********************************************************************
 *                      REQUEST TO GEMINI            *
 ********************************************************************/
async function sendToGemini(text, mapType) {
  createMagicBtn.disabled = true;
  createMagicBtn.style.opacity = "0.5"; // rende il bottone più chiaro

  console.log("[INFO] Invio richiesta a Gemini");
  console.log("[INFO] Testo inviato:", text);
  console.log("[INFO] Tipo mappa:", mapType);

  msgIndex = 0;
  loadingText.textContent = messages[msgIndex];
  intervalId = setInterval(() => {
    msgIndex++;
    if (msgIndex < messages.length) {
      loadingText.textContent = messages[msgIndex];
    } else {
      // arriva all'ultimo messaggio e si ferma qui
      clearInterval(intervalId);
      // opzionale: lascia l'ultimo messaggio visibile finché arriva la risposta
      msgIndex = messages.length - 1;
      loadingText.textContent = messages[msgIndex];
    }
  }, 2000);
  try {
    const response = await fetch(
      "https://conceptmap-pro.onrender.com/generateMap",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mapType }),
      }
    );

    console.log(
      "[INFO] Risposta ricevuta dal server, status:",
      response.status
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[ERROR] Server ha risposto con errore:", errorText);
      throw new Error(`Errore server: ${response.status}`);
    }

    const data = await response.json();
    console.log("[INFO] JSON ricevuto dal server:", data);
    clearInterval(intervalId);
    loadingText.textContent = "";
    msgIndex = 0;
    createMagicBtn.disabled = false;
    createMagicBtn.style.opacity = "1";

    // Mostra la sezione della mappa
    cleanMagicMap();

    textarea.value = "";
    showSection("magicMap");

    // Qui puoi passare direttamente l'array ricevuto dal server
    createMagicMap(data, mapType);
  } catch (err) {
    console.error("[ERROR] Errore durante sendToGemini:", err);
    clearInterval(intervalId);
    loadingText.textContent = "";
    msgIndex = 0;

    Toastify({
      text: "An error occurred while generating the map",
      duration: 2500,
      gravity: "top",
      position: "left",
      style: {
        background: "red",
        fontFamily: "'Poppins', sans-serif",
      },
    }).showToast();
    cleanMagicMap();
    showSection("magicMapPage");
  }
}
const homeFromMagic = document.getElementById("homeFromMagic");
homeFromMagic.addEventListener("click", () => {
  showSection("magicMapPage");
});
const magicMap = document.getElementById("magicMapContainer");
function cleanMagicMap() {
  magicRadialShape = [];
  nodeIndex = 0;
  magicMap.innerHTML = `<svg
        id="magicConnections"
        style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        "
      ></svg>`;
}
/********************************************************************
 *                      RESPONSE TAKEN AND STARTING MAP CREATION              *
 ********************************************************************/
function createMagicMap(prompt, modelType) {
  if (modelType.trim() === "radiale") {
    // Primo elemento come nodo principale
    const mainNode = Array.isArray(prompt[0])
      ? prompt[0].join(", ")
      : prompt[0];
    createMagicRadialShape("circle", mainNode, prompt.length);

    for (let i = 1; i < prompt.length; i++) {
      // Trasforma l'elemento in stringa se è un array
      const elementStr = Array.isArray(prompt[i])
        ? prompt[i].join(", ")
        : prompt[i];
      const elementParts = elementStr.split(" "); // ora funziona sempre

      if (elementParts.length > 2) {
        createMagicRadialShape("rectangle", elementStr, prompt.length);
      } else {
        createMagicRadialShape("box", elementStr, prompt.length);
      }
    }

    requestAnimationFrame(() => {
      createRadialLink(magicRadialShape);
    });
  }
}

let magicRadialShape = [];

let nodeIndex = 0;
function createMagicRadialShape(classe, text, maxLenght) {
  let localRadius;
  if (window.innerWidth <= 768) {
    localRadius = 250;
  } else {
    localRadius = 300;
  }

  const allDiv = document.querySelectorAll(".magicDiv");
  const div = document.createElement("div");
  div.classList.add(classe, "magicDiv");
  div.textContent = text;
  magicMap.appendChild(div);

  const rect = magicMap.getBoundingClientRect();
  const containerWidth = rect.width;
  const containerHeight = rect.height;

  const childWidth = div.offsetWidth;
  const childHeight = div.offsetHeight;

  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;

  if (allDiv.length === 0) {
    // primo nodo al centro
    div.style.left = `${centerX - childWidth / 2}px`;
    div.style.top = `${centerY - childHeight / 2}px`;
  } else {
    // nodi successivi in cerchio
    const totalNodesAround = maxLenght - 1; // numero massimo nodi per cerchio
    const angle = (2 * Math.PI * nodeIndex) / totalNodesAround;

    const x = centerX + localRadius * Math.cos(angle) - childWidth / 2;
    const y = centerY + localRadius * Math.sin(angle) - childHeight / 2;

    div.style.left = `${x}px`;
    div.style.top = `${y}px`;

    nodeIndex++; // incremento solo per i nodi attorno
  }
  magicRadialShape.push(div);
}
function createRadialLink(nodesArray) {
  const svg = document.getElementById("magicConnections");

  // Pulisce le linee precedenti
  svg.innerHTML = "";

  const centralDiv = nodesArray[0];
  const centralRect = centralDiv.getBoundingClientRect();
  const rectContainer = magicMap.getBoundingClientRect();
  const centralX =
    centralRect.left + centralRect.width / 2 - rectContainer.left;
  const centralY = centralRect.top + centralRect.height / 2 - rectContainer.top;
  for (let i = 1; i < nodesArray.length; i++) {
    const node = nodesArray[i];
    const nodeRect = node.getBoundingClientRect();
    const nodeX = nodeRect.left + nodeRect.width / 2;
    const nodeY = nodeRect.top + nodeRect.height / 2;

    // Vettore dal centro al nodo
    const dx = nodeX - centralX;
    const dy = nodeY - centralY;

    // Calcolo punto di uscita dal bordo del rettangolo centrale
    const centralHalfW = centralRect.width / 2;
    const centralHalfH = centralRect.height / 2;

    let tCentral;
    if (Math.abs(dx / centralHalfW) > Math.abs(dy / centralHalfH)) {
      // Interseca lato verticale
      tCentral = centralHalfW / Math.abs(dx);
    } else {
      // Interseca lato orizzontale
      tCentral = centralHalfH / Math.abs(dy);
    }
    const startX = centralX + dx * tCentral;
    const startY = centralY + dy * tCentral;

    // Calcolo punto di ingresso nel bordo del nodo secondario
    const nodeHalfW = nodeRect.width / 2;
    const nodeHalfH = nodeRect.height / 2;

    let tNode;
    if (Math.abs(dx / nodeHalfW) > Math.abs(dy / nodeHalfH)) {
      // Interseca lato verticale
      tNode = nodeHalfW / Math.abs(dx);
    } else {
      // Interseca lato orizzontale
      tNode = nodeHalfH / Math.abs(dy);
    }
    const endX = nodeX - dx * tNode;
    const endY = nodeY - dy * tNode;

    // Crea la linea SVG
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", startX);
    line.setAttribute("y1", startY);
    line.setAttribute("x2", endX);
    line.setAttribute("y2", endY);
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", "2");
    svg.appendChild(line);
  }
}
/********************************************************************
 *                       SCREENSHOT MAGIC MAP              *
 ********************************************************************/
const uploadMagicMap = document.getElementById("uploadMagicMap");

uploadMagicMap.addEventListener("click", () => {
  // Rimuovi le ombre temporaneamente

  html2canvas(magicMap).then((canvas) => {
    const link = document.createElement("a");
    link.download = "screenshot.png";
    link.href = canvas.toDataURL("image/png");
    link.click();

    // Ripristina le ombre
  });
});
