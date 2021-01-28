import React,{useState,useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import './App.css';
import Slider from "@material-ui/core/Slider";

const useStyles = makeStyles({
  app:{
    width: "100vw",
    height: "100vh",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },  
  settingsPad:{
    padding:  "1rem 2rem",
    position: "absolute",
    backgroundColor: "rgba(211, 211, 211,0.5)",
    transform: "translateY(-20vh,0)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderBottomLeftRadius: "10px",
    borderBottomRightRadius: "10px",
  },
  
  sizeSlider: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },

  opacitySlider:{
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },

  slider: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "170px",
    margin: "0 10px"
  },
  
  label: {
    width: "50px",
    textAlign: "center",
  },
  
  showSettingsButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "white",
    outline: "none",
    border: "0px",
    padding: "8px",
    borderRadius: "4px",
    fontWeight: "700",
  }
});


function App() {
  const src = "https://p1.hiclipart.com/preview/139/395/752/button-ui-requests-blue-and-white-target-illustration-png-clipart.jpg"
  const [screenButtonData,setScreenButtonData] = useState([]);
  const [selectedButton, setSelectedButton] = useState({index:0});
  const [selectedButtonPosition, setSelectedButtonPosition] = useState();
  const [isBtnTouchActive, setIsBtnTouchActive] = useState(false);
  const [touchStartCache, setTouchStartCache] = useState();
  const [screenData, setScreenData] = useState({})
  const [showSettingsTab, setShowSettingsTab] = useState(true)
  const classes = useStyles();
  useEffect(() => {
    const data = [
      {
        actionName:"shoot",
        svgSrc:src,
        attributes:{
          sizeRatio:1
        },
        style:{
          opacity:1,
          width:30,
          left:"80vw",
          top:"30vh",
        },  
        touchStartResponse:"spaceBar1Down",
        touchEndResponse:"spaceBar2Up"
      },
      {
        actionName:"shootHigh",
        svgSrc:src,
        attributes:{
          sizeRatio:1
        },
        style:{
          opacity:1,
          width:30,
          left:"70vw",
          top:"60vh",
        },  
        touchStartResponse:"spaceBar2Down",
        touchEndResponse:"spaceBar2Up"
      },
      {
        actionName:"heal",
        svgSrc:src,
        attributes:{
          sizeRatio:1
        },
        style:{
          opacity:1,
          width:30,
          left:"20vw",
          top:"50vh",
        },  
        touchStartResponse:"spaceBar3Down",
        touchEndResponse:"spaceBar3Up"
      },
      {
        actionName:"prone",
        svgSrc:src,
        attributes:{
          sizeRatio:1
        },
        style:{
          opacity:1,
          width:50,
          left:"40vw",
          top:"70vh",
        },  
        touchStartResponse:"spaceBar4Down",
        touchEndResponse:"spaceBar4Up"
      }
    ]
    setScreenButtonData(data);
    setScreenData({
      screenHeight: window.innerHeight,
      screenWidth: window.innerWidth
    })
  },[]);

  const assignAttributes = (object) => {
    const styleContainer = object.style
    const attributes = object.attributes
    const style = {
      position:'absolute',
      opacity:styleContainer.opacity,
      width:`${(styleContainer.width)}px`,
      height:"auto",
      top:styleContainer.top,
      left:styleContainer.left,
      transformOrigin: "center",
      transform: `scale(${attributes.sizeRatio},${attributes.sizeRatio})`
    }
    return style;
  }

  const touchStartEvent = (e) => {
    e.stopPropagation()
    const index = e.target.getAttribute("data-index")
    const object = e.target.getBoundingClientRect()
    setIsBtnTouchActive(true)
    setSelectedButtonPosition({
      left: object.left,
      top: object.top
    })
    for(let i=0;i<e.changedTouches.length;i++){
      const touch = e.changedTouches[i]  
    setSelectedButton({
      index: index,
      id: touch.identifier
    })
      setTouchStartCache({
        xpos : touch.clientX,
        ypos : touch.clientY
      })
    }
  }

  const touchMoveEvent = (e) => {
    e.stopPropagation()
    const index = e.target.getAttribute("data-index")
    let buttonList = [...screenButtonData];
    if(isBtnTouchActive && index===selectedButton.index){
      for(let i=0;i<e.changedTouches.length;i++){
        const touch = e.changedTouches[i]
        if(touch.identifier === selectedButton.id){
          buttonList[index].style.left = selectedButtonPosition.left - (touchStartCache.xpos - touch.clientX)
          buttonList[index].style.top = selectedButtonPosition.top - (touchStartCache.ypos - touch.clientY)
          setScreenButtonData(buttonList)
        }
      }
    }
  }

  const touchEndEvent = (e) => {
    setIsBtnTouchActive(false)
    const object = e.target.getBoundingClientRect()
    setSelectedButtonPosition({
      left: object.left,
      top: object.top
    })
  }

  const handleOpacityChange = (event, newValue) => {
    const index = selectedButton.index
    const buttonList = [...screenButtonData]
    buttonList[index].style.opacity = newValue/100
    setScreenButtonData(buttonList)
  };

  const handleSizeChange = (event, newValue) => {
    const index = selectedButton.index
    const buttonList = [...screenButtonData]
    buttonList[index].attributes.sizeRatio = newValue/100
    setScreenButtonData(buttonList)
  }

  const handleShowSettingsButton = () => {
    setShowSettingsTab(!showSettingsTab)
  }
  return (
    <div className={classes.app}>
      {
        screenButtonData?.map((object,index) => (
          <img src={object.svgSrc}
            key = {index}
            data-index = {index}
            className={object.actionName}
            style={assignAttributes(object)} alt=""
            onTouchStart = {touchStartEvent}
            onTouchMove = {touchMoveEvent}
            onTouchEnd = {touchEndEvent}
          />
        ))
      }
      <div className={classes.settingsPad}>
        {showSettingsTab &&
        (
        <div>
          <div className={classes.opacitySlider}>
            <p className={classes.label}>Opacity</p>
            <div className={classes.slider}>
            <Slider
              value={screenButtonData[selectedButton.index]?.style.opacity*100}
              onChange={handleOpacityChange}
              steps={1}
              min={10}
              max={100}
              aria-labelledby="continuous-slider"
            />
            </div>
            <p>{Math.round(screenButtonData[selectedButton.index]?.style.opacity*100)+"%"}</p>
          </div>
          <div className={classes.sizeSlider}>
            <p className={classes.label}>Size</p>
            <div className={classes.slider}>
            <Slider
              value={screenButtonData[selectedButton.index]?.attributes.sizeRatio*100}
              onChange={handleSizeChange}
              steps={1}
              min={10}
              max={200}
              aria-labelledby="continuous-slider"
            />
            </div>       
            <p>{Math.round(screenButtonData[selectedButton.index]?.attributes.sizeRatio*100)+"%"}</p>
          </div>
        </div>)}
        <button className={classes.showSettingsButton} onClick={handleShowSettingsButton}>{showSettingsTab?"Hide Settings":"Show Settings"}</button>
        
      </div>
        
    </div>
  );
}

export default App;
