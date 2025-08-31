document.addEventListener("mousedown", (event) => {
  if (event.target === document.body) {
    const x = event.clientX;
    const y = event.clientY;

    const lineIcon = document.createElement("span");
    lineIcon.innerHTML = `<i class="ri-arrow-right-line"></i>`;
    lineIcon.classList.add("line-icon");
    document.body.appendChild(lineIcon);
    lineIcon.style.left = `${x}px`;
    lineIcon.style.top = `${y}px`;
    lineIcon.style.position = "absolute";

    lineIcon.addEventListener("click", (e) => {
      const newX = event.clientX;
      const newY = event.clientY;
      e.stopPropagation();
      lineIcon.remove();
      form.remove();
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
      document.body.appendChild(lineArrow);
      lineArrow.style.left = `${newX}px`;
      lineArrow.style.top = `${newY}px`;
      lineArrow.style.position = "absolute";
      let InitRotation = 0;

      lineArrow.addEventListener("click", (e) => {
        if (
          lineArrow.children.length > 1 &&
          e.target.tagName !== "INPUT" &&
          e.target.tagName !== "SPAN"
        ) {
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

          let rotation = 0;
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
        }
      });
    });

    const form = document.createElement("div");
    form.classList.add("form-icon");
    form.innerHTML = `<i class="ri-square-line"></i>`;
    document.body.appendChild(form);
    form.style.left = `calc(${x}px + 50px)`;
    form.style.top = `${y}px`;
    form.style.position = "absolute";

    form.addEventListener("click", (e) => {
      const newX = e.clientX;
      const newY = e.clientY;
      form.remove();
      lineIcon.remove();
      const div = document.createElement("div");
      div.classList.add("box");

      div.style.left = `${newX}px`;
      div.style.top = `${newY}px`;
      div.style.transform = "translate(-50%, -50%)";
      document.body.appendChild(div);

      div.addEventListener("click", (e) => {
        if (div.children.length > 0) {
          div.innerHTML = "";
        } else {
          if (div.classList.contains("box")) {
            const rectangleIcon = document.createElement("span");
            rectangleIcon.innerHTML = `<i class="ri-rectangle-line"></i>`;
            rectangleIcon.classList.add("rectangle-icon");
            div.appendChild(rectangleIcon);

            rectangleIcon.addEventListener("click", (e) => {
              const newX = e.clientX;
              const newY = e.clientY;
              e.stopPropagation();
              console.log(newX, newY);
              div.classList.remove("box");
              div.classList.add("rectangle");
              div.style.left = `${newX}px`;
              div.style.top = `calc(${newY}px + 80px)`;
              deleteBtn.remove();

              div.style.transform = "translate(-50%, -50%)";
              rectangleIcon.remove();
              circleIcon.remove();
            });
            const circleIcon = document.createElement("span");
            circleIcon.innerHTML = `<i class="ri-circle-line"></i>`;
            circleIcon.classList.add("circle-icon");
            div.appendChild(circleIcon);

            circleIcon.addEventListener("click", (e) => {
              const newX = e.clientX;
              const newY = e.clientY;
              e.stopPropagation();
              console.log(newX, newY);
              div.classList.remove("box");
              div.classList.add("circle");
              div.style.left = `${newX}px`;
              div.style.top = `calc(${newY}px + 80px)`;
              deleteBtn.remove();

              div.style.transform = "translate(-50%, -50%)";
              circleIcon.remove();
              rectangleIcon.remove();
            });
          } else if (div.classList.contains("rectangle")) {
            const boxIcon = document.createElement("span");
            boxIcon.innerHTML = `<i class="ri-square-line"></i>`;
            boxIcon.classList.add("box-icon");
            div.appendChild(boxIcon);

            boxIcon.addEventListener("click", (e) => {
              const newX = e.clientX;
              const newY = e.clientY;
              e.stopPropagation();
              console.log(newX, newY);
              div.classList.remove("rectangle");
              div.classList.add("box");
              div.style.left = `${newX}px`;
              div.style.top = `calc(${newY}px + 80px)`;
              deleteBtn.remove();

              div.style.transform = "translate(-50%, -50%)";
              boxIcon.remove();
              circleIcon.remove();
            });

            const circleIcon = document.createElement("span");
            circleIcon.innerHTML = `<i class="ri-circle-line"></i>`;
            circleIcon.classList.add("circle-icon");
            div.appendChild(circleIcon);

            circleIcon.addEventListener("click", (e) => {
              const newX = e.clientX;
              const newY = e.clientY;
              e.stopPropagation();
              console.log(newX, newY);
              div.classList.remove("rectangle");
              div.classList.add("circle");
              div.style.left = `${newX}px`;
              div.style.top = `calc(${newY}px + 80px)`;
              deleteBtn.remove();

              div.style.transform = "translate(-50%, -50%)";
              circleIcon.remove();
              boxIcon.remove();
            });
          } else if (div.classList.contains("circle")) {
            const boxIcon = document.createElement("span");
            boxIcon.innerHTML = `<i class="ri-square-line"></i>`;
            boxIcon.classList.add("box-icon");
            div.appendChild(boxIcon);
            boxIcon.style.left = `calc(50% - 12px)`;
            boxIcon.style.top = `-50px`;

            boxIcon.addEventListener("click", (e) => {
              const newX = e.clientX;
              const newY = e.clientY;
              e.stopPropagation();
              console.log(newX, newY);
              div.classList.remove("circle");
              div.classList.add("box");
              div.style.left = `${newX}px`;
              div.style.top = `calc(${newY}px + 80px)`;
              deleteBtn.remove();

              div.style.transform = "translate(-50%, -50%)";
              boxIcon.remove();
              rectangleIcon.remove();
            });

            const rectangleIcon = document.createElement("span");
            rectangleIcon.innerHTML = `<i class="ri-rectangle-line"></i>`;
            rectangleIcon.classList.add("rectangle-icon");
            div.appendChild(rectangleIcon);

            rectangleIcon.addEventListener("click", (e) => {
              const newX = e.clientX;
              const newY = e.clientY;
              e.stopPropagation();
              console.log(newX, newY);
              div.classList.remove("circle");
              div.classList.add("rectangle");
              div.style.left = `${newX}px`;
              div.style.top = `calc(${newY}px + 80px)`;
              deleteBtn.remove();

              div.style.transform = "translate(-50%, -50%)";
              rectangleIcon.remove();
              boxIcon.remove();
            });
          }
          const deleteBtn = document.createElement("span");
          deleteBtn.innerHTML = `<i class="ri-delete-bin-line"></i>`;
          deleteBtn.classList.add("delete-btn");
          div.appendChild(deleteBtn);

          deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            div.remove();
          });

          let offsetX = 0;
          let offsetY = 0;
          let isDragging = false;
          div.addEventListener("mousedown", (e) => {
            isDragging = true;
            offsetX = e.clientX - div.offsetLeft;
            offsetY = e.clientY - div.offsetTop;
          });

          document.addEventListener("mousemove", (e) => {
            if (!isDragging) {
              return;
            }
            div.style.left = `${e.clientX - offsetX}px`;
            div.style.top = `${e.clientY - offsetY}px`;
            div.style.cursor = "grabbing";
          });
          document.addEventListener("mouseup", () => {
            isDragging = false;
            div.style.cursor = "grab";
          });
        }
      });
    });
  }
});
