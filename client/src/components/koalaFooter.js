import "../CSS/main.css";

export default function KoalaFooter({ koalaObjList, handleOpenNewKoala }) {
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
