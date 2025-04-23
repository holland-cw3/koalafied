import "../CSS/main.css";
import { useState, useEffect, useRef } from "react";

export default function KoalaFooter({
  koalaList,
  handleOpenNewKoala,
  handleClose,
}) {
  const globalKoalaList = require("../koalas/koalas.json").koalas;

  function getKoalaById(id) {
    // console.log("Koala list length: " + globalKoalaList.length);
    for (let i = 0; i < globalKoalaList.length; i++) {
      // console.log(globalKoalaList[i].id);
      if (id === globalKoalaList[i].id) return globalKoalaList[i];
    }
    return { name: "", description: "" };
  }

  function animateKoalas(koalaObjList, koalaTimeoutRef, handleClose) {
    // console.log("Animating!");
    // console.log(koalaObjList.length);
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    koalaObjList.forEach((koala) => {
      const elem = document.getElementById(koala.elemId);
      if (!elem) return;

      // Attach hover events once
      if (!koala._eventsAttached) {
        elem.addEventListener("mouseenter", () => {
          koala.hovered = true;
        });
        elem.addEventListener("mouseleave", () => {
          koala.hovered = false;
        });

        elem.addEventListener("mousedown", (e) => {
          koala.isDragging = true;
          koala.wasDragged = false;
          koala.dragStartX = e.clientX;
          koala.dragStartY = e.clientY;
          koala.originalLeftPos = koala.leftPos;
          koala.originalBottomPos = koala.bottomPos;
          koala.velocityY = 0;
          koala.isFalling = false;
          e.preventDefault();
        });

        document.addEventListener("mousemove", (e) => {
          if (koala.isDragging) {
            const deltaX = e.clientX - koala.dragStartX;
            const deltaY = e.clientY - koala.dragStartY;

            if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
              koala.wasDragged = true;
            }

            koala.leftPos = clamp(
              koala.originalLeftPos + deltaX,
              -50,
              window.innerWidth
            );
            koala.bottomPos = clamp(
              koala.originalBottomPos + deltaY * -1,
              0,
              window.innerHeight
            ); // up is +bottom

            elem.style.left = `${koala.leftPos}px`;
            elem.style.bottom = `${koala.bottomPos}px`;

            const rotation = Math.random() * 20 - 10;
            elem.style.transform = `rotate(${rotation}deg)`;
          }
        });

        document.addEventListener("mouseup", () => {
          if (koala.isDragging) {
            koala.isDragging = false;
            koala.isFalling = true;
          }
        });

        document.addEventListener("mouseup", () => {
          koala.isDragging = false;
          elem.style.transform = "rotate(0deg)";
          elem.style.bottom = `${koala.bottomPos}px`;
        });

        koala._eventsAttached = true;
      }

      // Stop animation if hovered
      if (koala.hovered) return;

      if (koala.isFalling) {
        // Simulate gravity
        koala.velocityY -= 0.5; // gravity acceleration (tweak as needed)
        koala.bottomPos += koala.velocityY;

        if (koala.bottomPos <= 5) {
          koala.bottomPos = 5;
          koala.velocityY = 0;
          koala.isFalling = false;
        }

        elem.style.bottom = `${koala.bottomPos}px`;
        elem.style.transform = `rotate(${Math.random() * 10 - 5}deg)`;
        return; // skip normal movement while falling
      } else {
        if (koala.sleepTime <= 0) {
          let shouldSleep = koala.walkTime <= 0;

          if (shouldSleep) {
            koala.sleepTime = Math.random() * 50 + 10;
          } else {
            const directionMultiplier = koala.direction === "left" ? -1 : 1;

            // Update horizontal position
            koala.leftPos += Math.random() * 4 * directionMultiplier;
            koala.leftPos = clamp(koala.leftPos, -200, window.innerWidth + 200);
            // if at one end flip direction
            if (
              koala.leftPos === window.innerWidth + 200 ||
              koala.leftPos === -200
            ) {
              if (koala.direction === "right") {
                koala.direction = "left";
              } else {
                koala.direction = "right";
              }
            }
            elem.style.left = `${koala.leftPos}px`;

            // Update vertical position
            let doUpDown = Math.random() * 10 >= 5;
            if (doUpDown) {
              koala.bottomPos += Math.random() * 2 - 1;
              koala.bottomPos = clamp(koala.bottomPos, 5, 10);
              elem.style.bottom = `${koala.bottomPos}px`;
              elem.style.zIndex = 10000000 - koala.bottomPos;
            }

            let doRotation = Math.random() * 10 >= 3;
            if (doRotation)
              elem.style.transform =
                "rotate(" + (Math.random() * 4 - 2) + "deg)";

            koala.walkTime--;
          }
        } else {
          koala.sleepTime--;

          if (koala.sleepTime <= 0) {
            koala.walkTime = Math.random() * 150 + 25;
            let changeDirection = Math.random() * 100 > 90;
            if (changeDirection) {
              if (koala.direction === "left") {
                koala.direction = "right";
              } else {
                koala.direction = "left";
              }
            }
          }
          let doRotation = Math.random() * 10 >= 8;
          if (doRotation)
            elem.style.transform = "rotate(" + (Math.random() * 4 - 2) + "deg)";
        }
      }
    });

    clearTimeout(koalaTimeoutRef.current);
    koalaTimeoutRef.current = setTimeout(() => {
      animateKoalas(koalaObjList, koalaTimeoutRef, handleClose);
    }, 100);
  }

  const [koalaObjList, setKoalaObjList] = useState([]);

  let koalaTimeout = useRef(null);

  useEffect(() => {
    const newKoalas = [];

    koalaList.forEach((koalaId, i) => {
      const koala = getKoalaById(koalaId);

      if (!koalaObjList.some((k) => k.id === koala.id)) {
        console.log("Adding koala!");
        newKoalas.push({
          id: koala.id,
          desc: koala.description,
          name: koala.name,
          filename: koala.filename,
          elemId: koala.id + "-" + i,
          leftPos: Math.random() * 1000,
          bottomPos: Math.random() * 10 + 10,
          direction: Math.random() < 0.5 ? "left" : "right",
          zIndex: Math.random() * 100 + 50,
          src: require("../koalas/" + koala.filename),
          sleepTime: 0,
          walkTime: Math.random() * 150 + 50,
          hovered: false,
          isDragging: false,
          dragStartX: 0,
          originalLeftPos: 0,
          dragStartY: 0,
          originalBottomPos: 0,
          velocityY: 0,
          isFalling: false,
          wasDragged: false,
        });
      }
    });

    if (newKoalas.length > 0) {
      setKoalaObjList((prev) => {
        const combined = [...prev, ...newKoalas];
        animateKoalas(combined, koalaTimeout, handleClose);
        return combined;
      });
    } else {
      animateKoalas(koalaObjList, koalaTimeout, handleClose);
    }
  }, [koalaList, koalaObjList]);

  return (
    <div className="footer">
      <div className="koalas">
        {koalaObjList.map((item) => (
          <img
            id={item.elemId}
            className="koalaSprite"
            src={item.src}
            alt={item.name}
            style={{
              left: item.leftPos,
              bottom: item.bottomPos,
              zIndex: item.zIndex,
            }}
            onClick={() =>
              handleOpenNewKoala(item.name, item.desc, item.filename, false)
            }
          ></img>
        ))}
      </div>
    </div>
  );
}
