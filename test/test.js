const drawingSection = document.getElementById("drawSection");
const sidebarIcon = document.querySelectorAll(".sidebarIcon");
let activeIconId = "addIcon";
sidebarIcon.forEach((icon) => {
  icon.addEventListener("click", () => {
    sidebarIcon.forEach((i) => i.classList.remove("active"));
    icon.classList.add("active");
    activeIconId = icon.id;
    console.log("Attiva:", activeIconId);
  });
});

function createShape(type, x, y) {
  const shape = document.createElement("div");
  shape.classList.add(type);
  shape.style.left = `${x}px`;
  shape.style.top = `${y}px`;
  drawingSection.appendChild(shape);

  shape.addEventListener("click", () => {
    if (type === "box" && shape.children.length === 0) {
      const rectangleIcon = document.createElement("span");
      rectangleIcon.classList.add("rectangle-icon");
      rectangleIcon.innerHTML = `<i class="ri-rectangle-line"></i>`;
      shape.appendChild(rectangleIcon);

      rectangleIcon.addEventListener("click", (e) => {
        shape.classList.add("rectangle");
        shape.classList.remove("box");
        type = "rectangle";
        removeIcon();
      });

      const circleIcon = document.createElement("span");
      circleIcon.classList.add("circle-icon");
      circleIcon.innerHTML = `<i class="ri-circle-line"></i>`;
      shape.appendChild(circleIcon);

      circleIcon.addEventListener("click", (e) => {
        shape.classList.add("circle");
        shape.classList.remove("box");
        type = "circle";
        removeIcon();
      });

      const trash = document.createElement("span");
      trash.classList.add("delete-btn");
      trash.innerHTML = `<i class="ri-delete-bin-line"></i>`;
      shape.appendChild(trash);

      trash.addEventListener("click", (e) => {
        e.stopPropagation();
        shape.remove();
      });

      function removeIcon() {
        trash.remove();
        circleIcon.remove();
        rectangleIcon.remove();
      }
    } else if (type === "box" && shape.children.length > 0) {
      shape.innerHTML = "";
      console.log("Rimuovi icone");
    }
    if (type === "rectangle" && shape.children.length === 0) {
      const circleIcon = document.createElement("span");
      circleIcon.classList.add("circle-icon");
      circleIcon.innerHTML = `<i class="ri-circle-line"></i>`;
      shape.appendChild(circleIcon);

      circleIcon.addEventListener("click", (e) => {
        shape.classList.add("circle");
        shape.classList.remove("box");
        type = "circle";
        removeIcon();
      });

      const squareIcon = document.createElement("span");
      squareIcon.classList.add("box-icon");
      squareIcon.innerHTML = `<i class="ri-square-line"></i>`;
      shape.appendChild(squareIcon);

      squareIcon.addEventListener("click", (e) => {
        shape.classList.add("box");
        shape.classList.remove("rectangle");
        type = "box";
        removeIcon();
      });

      const trash = document.createElement("span");
      trash.classList.add("delete-btn");
      trash.innerHTML = `<i class="ri-delete-bin-line"></i>`;
      shape.appendChild(trash);

      trash.addEventListener("click", (e) => {
        e.stopPropagation();
        shape.remove();
      });

      function removeIcon() {
        trash.remove();
        circleIcon.remove();
        squareIcon.remove();
      }
    } else if (type === "rectangle" && shape.children.length > 0) {
      shape.innerHTML = "";
    }

    if (type === "circle" && shape.children.length === 0) {
      const rectangleIcon = document.createElement("span");
      rectangleIcon.classList.add("rectangle-icon");
      rectangleIcon.innerHTML = `<i class="ri-rectangle-line"></i>`;
      shape.appendChild(rectangleIcon);
      rectangleIcon.style.left = `37px`;

      rectangleIcon.addEventListener("click", (e) => {
        shape.classList.add("rectangle");
        shape.classList.remove("circle");
        type = "rectangle";
        removeIcon();
      });

      const squareIcon = document.createElement("span");
      squareIcon.classList.add("box-icon");
      squareIcon.innerHTML = `<i class="ri-square-line"></i>`;
      shape.appendChild(squareIcon);

      squareIcon.addEventListener("click", (e) => {
        shape.classList.add("box");
        shape.classList.remove("circle");
        type = "box";
        removeIcon();
      });

      const trash = document.createElement("span");
      trash.classList.add("delete-btn");
      trash.innerHTML = `<i class="ri-delete-bin-line"></i>`;
      shape.appendChild(trash);

      trash.addEventListener("click", (e) => {
        e.stopPropagation();
        shape.remove();
      });

      function removeIcon() {
        trash.remove();
        squareIcon.remove();
        rectangleIcon.remove();
      }
    } else if (type === "circle" && shape.children.length > 0) {
      shape.innerHTML = "";
    }
  });

  makeDraggable();

  function makeDraggable() {
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;
    shape.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - shape.offsetLeft;
      offsetY = e.clientY - shape.offsetTop;
      shape.style.cursor = "grab";
    });
    document.addEventListener("mousemove", (e) => {
      if (!isDragging) {
        return;
      }
      shape.style.left = `${e.clientX - offsetX}px`;
      shape.style.top = `${e.clientY - offsetY}px`;
      shape.style.cursor = "grabbing";
    });
    document.addEventListener("mouseup", () => {
      isDragging = false;
      shape.style.cursor = "pointer";
    });
  }
}
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
  let InitRotation = 0;

  lineArrow.addEventListener("click", (e) => {
    function cleanArrow() {
      lineArrow.innerHTML = `
        <svg width="120" height="20" viewBox="0 0 120 20" xmlns="http://www.w3.org/2000/svg">
          <!-- Corpo della freccia -->
          <line x1="0" y1="10" x2="100" y2="10" stroke="${color}" stroke-width="3" />
          <!-- Punta della freccia -->
          <polygon points="100,0 120,10 100,20" fill="${color}" />
        </svg>`;

      const svg = lineArrow.querySelector("svg");
      svg.style.transformOrigin = "0, 50%";
      console.log(InitRotation);
      svg.style.transform = `rotate(${InitRotation}deg)`;
    }
    if (
      lineArrow.children.length > 1 &&
      e.target.tagName !== "INPUT" &&
      e.target.tagName !== "SPAN"
    ) {
      cleanArrow();
    } else {
      const colorInput = document.createElement("input");
      colorInput.type = "color";
      colorInput.value = "#000000";
      lineArrow.appendChild(colorInput);
      colorInput.classList.add("color-input");

      colorInput.addEventListener("change", (e) => {
        const newcolor = e.target.value;
        color = newcolor;
        changeArrow(color);
      });

      const trashIcon = document.createElement("span");
      trashIcon.innerHTML = `<i class="ri-delete-bin-line"></i>`;

      trashIcon.classList.add("arrowTrash-Icon");
      lineArrow.appendChild(trashIcon);

      trashIcon.style.position = "absolute";

      trashIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        trashIcon.remove();
        lineArrow.remove();
        colorInput.remove();
      });

      const turnLeft = document.createElement("span");
      turnLeft.innerHTML = `<i class="ri-corner-left-down-fill"></i>`;
      lineArrow.appendChild(turnLeft);
      turnLeft.classList.add("turn-icon");
      turnLeft.classList.add("turn-left");

      turnLeft.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
      });

      const turnRight = document.createElement("span");
      turnRight.innerHTML = `<i class="ri-corner-right-down-fill"></i>`;
      lineArrow.appendChild(turnRight);
      turnRight.classList.add("turn-icon");
      turnRight.classList.add("turn-right");

      turnRight.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
      });

      let rotation = InitRotation;
      let rotateInterval = null;

      turnLeft.addEventListener("mousedown", (e) => {
        e.stopPropagation();
        // Ruota di -2 gradi ogni 20ms
        rotateInterval = setInterval(() => {
          rotation -= 2;
          lineArrow.querySelector(
            "svg"
          ).style.transform = `rotate(${rotation}deg)`;
          lineArrow.querySelector("svg").style.transformOrigin = "0, 50%";
        }, 20);
      });

      turnLeft.addEventListener("mouseup", (e) => {
        clearInterval(rotateInterval);
        console.log(InitRotation);
        InitRotation = rotation;
      });

      turnLeft.addEventListener("mouseleave", (e) => {
        clearInterval(rotateInterval);
        InitRotation = rotation;
      });

      turnRight.addEventListener("mousedown", (e) => {
        e.stopPropagation();
        rotateInterval = setInterval(() => {
          rotation += 2;
          lineArrow.querySelector(
            "svg"
          ).style.transform = `rotate(${rotation}deg)`;
          lineArrow.querySelector("svg").style.transformOrigin = "0, 50%";
        }, 20);
      });

      turnRight.addEventListener("mouseup", (e) => {
        clearInterval(rotateInterval);
      });

      turnRight.addEventListener("mouseleave", (e) => {
        clearInterval(rotateInterval);
        InitRotation = rotation;
      });

      lineArrow.addEventListener("mousedown", (e) => {
        if (activeIconId === "cornerIconLeft") {
          e.stopPropagation();
          e.stopPropagation();
          // Ruota di -2 gradi ogni 20ms
          rotateInterval = setInterval(() => {
            rotation -= 2;
            lineArrow.querySelector(
              "svg"
            ).style.transform = `rotate(${rotation}deg)`;
            lineArrow.querySelector("svg").style.transformOrigin = "0, 50%";
          }, 20);
        }
      });
      lineArrow.addEventListener("mouseup", (e) => {
        if (activeIconId === "cornerIconLeft") {
          e.stopPropagation();
        }
        clearInterval(rotateInterval);
        InitRotation = rotation;
      });
      lineArrow.addEventListener("mouseleave", (e) => {
        if (activeIconId === "cornerIconLeft") {
          e.stopPropagation();
        }
        clearInterval(rotateInterval);
        InitRotation = rotation;
      });

      lineArrow.addEventListener("mousedown", (e) => {
        if (activeIconId === "cornerIconRight") {
          e.stopPropagation();
          e.stopPropagation();
          rotateInterval = setInterval(() => {
            rotation += 2;
            lineArrow.querySelector(
              "svg"
            ).style.transform = `rotate(${rotation}deg)`;
            lineArrow.querySelector("svg").style.transformOrigin = "0, 50%";
          }, 20);
        }
      });
      lineArrow.addEventListener("mouseup", (e) => {
        if (activeIconId === "cornerIconRight") {
          e.stopPropagation();
        }
        clearInterval(rotateInterval);
        InitRotation = rotation;
      });
      lineArrow.addEventListener("mouseleave", (e) => {
        if (activeIconId === "cornerIconRight") {
          e.stopPropagation();
        }
        clearInterval(rotateInterval);
        InitRotation = rotation;
      });
    }
  });

  makeDraggable();
  function makeDraggable() {
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;
    lineArrow.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - lineArrow.offsetLeft;
      offsetY = e.clientY - lineArrow.offsetTop;
      lineArrow.style.cursor = "grab";
    });
    document.addEventListener("mousemove", (e) => {
      if (!isDragging) {
        return;
      }
      lineArrow.style.left = `${e.clientX - offsetX}px`;
      lineArrow.style.top = `${e.clientY - offsetY}px`;
      lineArrow.style.cursor = "grabbing";
    });
    document.addEventListener("mouseup", () => {
      isDragging = false;
      lineArrow.style.cursor = "pointer";
    });
  }
}

drawingSection.addEventListener("mousedown", (event) => {
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

      lineIcon.addEventListener("click", () => {
        const newX = event.clientX;
        const newY = event.clientY;

        lineIcon.remove();
        form.remove();
        createArrow(newX, newY);
      });

      form.addEventListener("click", (e) => {
        createShape("box", e.clientX, e.clientY);
        form.remove();
        lineIcon.remove();
      });
    }
  }
  if (activeIconId === "squareIcon" && event.target == drawingSection) {
    createShape("box", event.clientX, event.clientY);
  }
  if (activeIconId === "circleIcon" && event.target == drawingSection) {
    createShape("circle", event.clientX, event.clientY);
  }
  if (activeIconId === "rectangleIcon" && event.target == drawingSection) {
    createShape("rectangle", event.clientX, event.clientY);
  }
  if (activeIconId === "arrowIcon" && event.target == drawingSection) {
    createArrow(event.clientX, event.clientY);
  }
});
