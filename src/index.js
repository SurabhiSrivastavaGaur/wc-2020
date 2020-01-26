import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";
import parseText from "./parseText";
import WordCloud from "./WordCloud";
import { Switch, RangeSlider, Classes } from "@blueprintjs/core";
import { Colorscale } from "react-colorscales";
import ColorscalePicker from "react-colorscales";
import chroma from "chroma-js";
import FontPicker from "font-picker-react";

import "./style.css";

function App() {
  const [data, setData] = useState(null);
  const [angle, setAngle] = useState(60);
  const [angleSteps, setAngleSteps] = useState(4);
  const [fontSizeSmall, setFontSizeSmall] = useState(12);
  const [fontSizeLarge, setFontSizeLarge] = useState(40);
  const [showCounts, setShowCounts] = useState(true);
  const [countSize, setCountSize] = useState(5);
  const [minOccurence, setMinOccurence] = useState(0);
  const [padding, setPadding] = useState(0);
  const [file, setFile] = useState("YIP.txt");
  const [colorScale, setColorScale] = useState(chroma.brewer.dark2);
  const [showColorscalePicker, setShowColorscalePicker] = useState(false);
  const [activeFontFamily, setActiveFontFamily] = useState("Impact");

  // const viridisColorscale = [
  //   "#fafa6e",
  //   "#9cdf7c",
  //   "#4abd8c",
  //   "#00968e",
  //   "#106e7c",
  //   "#2a4858"
  // ];

  const initialFontRange = [12, 40];
  const [fontRange, setFontRange] = useState(initialFontRange);
  //var fontRange = initialFontRange;
  useEffect(() => {
    console.log("trying to load file = " + file);
    d3.text(file)
      .then(parseText)
      .then(setData);
  }, [file]);

  //console.log(data);

  return (
    <div className="App">
      <React.StrictMode>
        <div className="grid-container">
          <div className="header-logo">
            {/* <img
              src="./img/dark-blue-polygon-background.png"
              alt="Word Cloud"
            /> */}

            <div className="header-logo-text-grid">
              <div className="header-logo-space" />
              <div className="header-logo-title">Analyze Words</div>
              <div className="header-logo-subtitle">
                Show what the distribution of your words looks like by using
                different chart types.
              </div>
            </div>
          </div>
          <div className="header-main">
            <div className="title item-header">
              {/* <h1>Hello Vizer</h1> */}
            </div>
          </div>

          <div className="header-config">
            <div className="header-config-text-grid">
              <div className="header-config-space" />
              <div className="header-config-title">Visualization Settings</div>
              <div className="header-config-subtitle">
                Set the parameters below to customize your visual
              </div>
            </div>
          </div>
          <div className="left-nav">
            <div className="data-config-text-grid">
              <div className="data-config-space" />
              <div className="data-config-title">Data</div>
              <div className="data-config-subtitle">Fetch and adjust data</div>
              <div className="data-config-controls">
                <label className="bp3-label">
                  File
                  <div className="bp3-select bp3-text-small">
                    <div>
                      <select onChange={e => setFile(e.target.value)}>
                        {/* <option selected>Choose an item...</option> */}
                        <option defaultValue value="YIP.txt">
                          YIP.txt
                        </option>
                        <option value="Journals.txt">Journals.txt</option>
                        <option value="GeneticDisorders.txt">
                          GeneticDisorders.txt
                        </option>
                      </select>
                    </div>
                  </div>
                </label>
                <div>
                  <label className="bp3-label">Font</label>

                  <FontPicker
                    apiKey="AIzaSyDABs0N895c_6fDdMYXz8D-J_Ow140QQUg"
                    activeFontFamily={activeFontFamily}
                    onClick={() => {
                      setShowColorscalePicker(false);
                    }}
                    onChange={nextFont => {
                      setShowColorscalePicker(false);
                      setActiveFontFamily(nextFont.family);
                    }}
                  />
                  {/* <p className="apply-font">
                    The font will be applied to this text.
                  </p> */}
                </div>

                <br />
                <label className="bp3-label">Color Scale</label>
                <div>
                  <Colorscale
                    colorscale={colorScale}
                    onClick={() => {
                      setShowColorscalePicker(!showColorscalePicker);
                    }}
                    width={150}
                  />
                  {showColorscalePicker && (
                    <ColorscalePicker
                      onChange={e => {
                        // console.log(e);
                        // debugger;
                        setColorScale(e);
                      }}
                      colorscale={colorScale}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="visual-main">
            <div className="wordcloud item-b ">
              <svg width="800" height="800">
                <WordCloud
                  words={data}
                  width={800}
                  height={800}
                  angle={angle}
                  fontSizeLarge={fontSizeLarge}
                  fontSizeSmall={fontSizeSmall}
                  showCounts={showCounts}
                  countSize={countSize}
                  minOccurence={minOccurence}
                  padding={padding}
                  angleSteps={angleSteps}
                  colorScale={colorScale}
                  activeFontFamily={activeFontFamily}
                />
              </svg>
            </div>
          </div>
          <div className="visual-config" align="left">
            <div className="visual-config-grid">
              <label className="bp3-label bp3-inline">Angles</label>
              <input
                id="angles"
                className={Classes.INPUT}
                style={{ width: "50px", textAlign: "right" }}
                type="text"
                value={angle}
                onChange={e => setAngle(+e.target.value)}
              />
              <label className="bp3-label bp3-inline">Angle Steps</label>
              <input
                id="angleSteps"
                className={Classes.INPUT}
                style={{ width: "50px", textAlign: "right" }}
                type="text"
                value={angleSteps}
                onChange={e => setAngleSteps(+e.target.value)}
              />
              <label className="bp3-label bp3-inline">Font Start</label>
              <input
                type="text"
                className={Classes.INPUT}
                style={{ width: "50px", textAlign: "right" }}
                value={fontSizeSmall}
                onChange={e => setFontSizeSmall(+e.target.value)}
              />
              <label className="bp3-label bp3-inline">Font Stop</label>
              <input
                type="text"
                className={Classes.INPUT}
                style={{ width: "50px", textAlign: "right" }}
                value={fontSizeLarge}
                onChange={e => setFontSizeLarge(+e.target.value)}
              />
              <div style={{ width: "50px" }}>
                <RangeSlider
                  min={5}
                  max={100}
                  stepSize={2}
                  labelStepSize={20}
                  onRelease={range => {
                    // setFontRange(range);
                    //console.log("slider moved");
                    setFontSizeSmall(range[0]);
                    setFontSizeLarge(range[1]);
                  }}
                  onChange={range => {
                    //console.log(range);
                    setFontRange(range); //need to keep the state updated to allow the endpoints to move visually though the actual range parameters are updated only when the endpoints are released
                  }}
                  value={fontRange}
                  vertical={false}
                />
              </div>
              <br />
              <label>Show Counts</label>
              <Switch
                checked={showCounts}
                onChange={e => setShowCounts(e.currentTarget.checked)}
              />
              <label className="bp3-label bp3-inline">Count Size</label>
              <input
                className={Classes.INPUT}
                style={{ width: "50px", textAlign: "right" }}
                type="text"
                value={countSize}
                onChange={e => setCountSize(+e.target.value)}
              />
              <label className="bp3-label bp3-inline">Min Occurence</label>
              <input
                className={Classes.INPUT}
                style={{ width: "50px", textAlign: "right" }}
                type="text"
                value={minOccurence}
                onChange={e => setMinOccurence(+e.target.value)}
              />
              <label className="bp3-label bp3-inline">Padding</label>
              <input
                className={Classes.INPUT}
                style={{ width: "50px", textAlign: "right" }}
                type="text"
                value={padding}
                onChange={e => setPadding(+e.target.value)}
              />
            </div>
          </div>
          <div className="footer-info"> </div>
          <div className="footer-main" />
          <div className="footer-help" />
        </div>
      </React.StrictMode>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
