import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import d3Cloud from "d3-cloud";
import chroma from "chroma-js";

// import seedrandom from "seedrandom";

function count(words) {
  let counts = {};

  for (let w in words) {
    ////console.log("trying to count words: " + w + " : " + words[w]);
    counts[words[w]] = (counts[words[w]] || 0) + 1;
  }

  return counts;
}

class Word extends React.Component {
  ref = React.createRef();
  state = { transform: this.props.transform };

  componentDidUpdate() {
    const { transform } = this.props;
    d3.select(this.ref.current)
      .transition()
      .duration(5)
      .attr("transform", this.props.transform)
      .on("end", () => this.setState({ transform }));
  }

  render() {
    const { style, counter, showCounts, countSize, children } = this.props,
      { transform } = this.state;
    //console.log("Value of showCounts inside word is: " + showCounts);
    //debugger;
    return (
      <text
        transform={transform}
        textAnchor="middle"
        style={style}
        ref={this.ref}
      >
        <div> {showCounts} </div>
        {children}
        {showCounts && (
          // <tspan fontSize={style.fontSize - 3} baseline-shift="super">
          //   {" " + counter}
          // </tspan>
          <tspan fontSize={countSize}>{" " + counter}</tspan>
        )}
      </text>
    );
  }
}

function createCloud({
  words,
  width,
  height,
  angle,
  fontSizeSmall,
  fontSizeLarge,
  showCounts,
  countSize,
  minOccurence,
  padding,
  angleSteps,
  activeFontFamily
}) {
  return new Promise(resolve => {
    const counts = count(words);
    const fontSize = d3
      .scaleLog()
      .domain(d3.extent(Object.values(counts)))
      .range([fontSizeSmall, fontSizeLarge]);

    //debugger;
    //console.log("logging from create cloud: \n" + words);
    const layout = d3Cloud()
      .size([width, height])
      .words(
        Object.keys(counts)
          .filter(w => counts[w] > minOccurence)
          .map(word => ({ word }))
      )
      .padding(padding)
      .font(activeFontFamily)
      .fontSize(d => fontSize(counts[d.word]))
      //.text(d => d.word + (counts[d.word] > 1 ? "-" + counts[d.word] : ""))
      .text(d => d.word)
      .rotate(function() {
        //
        var rng = Math.random(); //seedrandom ('5');
        //console.log(rng);
        //                debugger;
        return ((~~(rng * (angleSteps + 1)) - angleSteps / 2) * angle) / 2;
      })
      .on("end", resolve);

    layout.start();
    // debugger;
  });
}

const WordCloud = ({
  words,
  width,
  height,
  angle,
  fontSizeSmall,
  fontSizeLarge,
  showCounts,
  countSize,
  minOccurence,
  padding,
  angleSteps,
  colorScale,
  activeFontFamily
}) => {
  const [cloud, setCloud] = useState(null);
  useEffect(() => {
    //console.log("started drawing");
    createCloud({
      words,
      width,
      height,
      angle,
      fontSizeSmall,
      fontSizeLarge,
      showCounts,
      countSize,
      minOccurence,
      padding,
      angleSteps,
      colorScale,
      activeFontFamily
    }).then(cloud => {
      //console.log("done drawing");
      setCloud(cloud);
    });
    // console.log("trying to log cloud: " );
  }, [
    words,
    width,
    height,
    angle,
    fontSizeSmall,
    fontSizeLarge,
    showCounts,
    countSize,
    minOccurence,
    padding,
    angleSteps,
    colorScale,
    activeFontFamily
  ]);

  const colors = colorScale.reverse();
  const counts = count(words);
  const colorRange = d3.scaleLinear(d3.extent(Object.values(counts)), [
    1,
    colors.length
  ]);
  //debugger;
  //console.log(activeFontFamily);
  return (
    cloud && (
      <>
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {cloud.map((w, i) => (
            <Word
              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
              style={{
                fontSize: w.size,
                //fontFamily:"Impact" ,
                fontFamily: activeFontFamily,
                //fill: colors[i % colors.length]
                fill: colorScale[Math.round(colorRange(counts[w.word])) - 1]
              }}
              counter={counts[w.word]}
              key={w.word}
              showCounts={showCounts}
              countSize={countSize}
              activeFontFamily={activeFontFamily}
            >
              {w.word}
            </Word>
          ))}
        </g>
      </>
    )
  );
};
export default WordCloud;
