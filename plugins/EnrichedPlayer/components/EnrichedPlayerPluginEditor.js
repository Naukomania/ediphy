import React from 'react';
import { findDOMNode } from 'react-dom';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull';
import MarkEditor from './../../../_editor/components/rich_plugins/mark_editor/MarkEditor';
import Mark from '../../../common/components/mark/Mark';
import img from './../../../dist/images/broken_link.png';
/* eslint-disable react/prop-types */

export default class EnrichedPlayerPluginEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            volume: 0.8,
            duration: 0,
            played: 0,
            seeking: false,
            fullscreen: false,
            // controls: this.props.state.controls || true,
        };
    }

    playPause() {
        this.setState({ playing: !this.state.playing });
    }

    onClickFullscreen() {
        if(!this.state.fullscreen) {
            screenfull.request(findDOMNode(this.player_wrapper));
        } else {
            screenfull.exit();
        }
        this.setState({ fullscreen: !this.state.fullscreen });
    }

    setVolume(e) {
        this.setState({ volume: parseFloat(e.target.value) });
    }

    setPlaybackRate(e) {
        this.setState({ playbackRate: parseFloat(e.target.value) });
    }

    onSeekMouseDown() {
        this.setState({ seeking: true });
    }

    onSeekChange(e) {
        this.setState({ played: (e.clientX - e.target.getBoundingClientRect().left) / e.target.getBoundingClientRect().width });
    }

    onSeekMouseUp(e) {
        if(e.target.className.indexOf('progress-player-input') !== -1) {
            this.setState({ seeking: false });
        }
        this.player.seekTo((e.clientX - e.target.getBoundingClientRect().left) / e.target.getBoundingClientRect().width);
    }

    onProgress(state) {
        // We only want to update time slider if we are not currently seeking
        if (!this.state.seeking) {
            this.setState(state);
        }
    }

    getDuration() {
        return this.state.duration;
    }

    render() {

        let marks = this.props.props.marks || {};

        let markElements = Object.keys(marks).map((id) =>{
            let value = marks[id].value;
            let title = marks[id].title;
            let color = marks[id].color;

            return(
                <MarkEditor key={id} style={{ left: value, position: "absolute", top: "5px" }} time={1.5} mark={id} marks={marks} onRichMarkMoved={this.props.props.onRichMarkMoved} state={this.props.state} base={this.props.base}>
                    <div className="videoMark" style={{ background: color || "#17CFC8" }}>
                        <Mark style={{ position: 'relative', top: "-24px", left: "-10px" }} color={color || "#17CFC8"} idKey={id} title={title} />
                    </div>
                </MarkEditor>);
        });

        return (
            <div ref={player_wrapper => {this.player_wrapper = player_wrapper;}} style={{ width: "100%", height: "100%", pointerEvents: "none" }} className="enriched-player-wrapper">
                <ReactPlayer
                    ref={player => { this.player = player; }}
                    style={{ width: "100%", height: "100%" }}
                    height="100%"
                    width="100%"
                    url={this.props.state.url}
                    playing={this.state.playing}
                    // fileConfig={{ attributes: { poster: img } }}
                    volume={this.state.volume}
                    onPlay={() => this.setState({ playing: true })}
                    onPause={() => this.setState({ playing: false })}
                    onEnded={() => this.setState({ playing: false })}
                    onProgress={this.onProgress.bind(this)}
                    onDuration={duration => this.setState({ duration })}
                />
                {this.props.state.controls ?
                    <div className="player-media-controls" style={{ pointerEvents: 'none' }}>
                        <button className="play-player-button" onClick={this.playPause.bind(this)}>{this.state.playing ? <i className="material-icons">pause</i> : <i className="material-icons">play_arrow</i>}</button>
                        <div className="progress-player-input dropableRichZone" style={{ height: "20px", position: "relative", bottom: '5px' }}>
                            <div className="fakeProgress" />
                            <div className="mainSlider" style={{ position: "absolute", left: this.state.played * 100 + "%" }} />
                            {markElements}
                        </div>
                        <input className="volume-player-input " type='range' min={0} max={1} step='any' value={this.state.volume} onChange={this.setVolume.bind(this)} />
                        <button className="fullscreen-player-button" onClick={this.onClickFullscreen.bind(this)}>{(!this.state.fullscreen) ? <i className="material-icons">fullscreen</i> : <i className="material-icons">fullscreen_exit</i>}</button>
                    </div> :
                    <div className="player-media-controls" style={{ pointerEvents: 'none' }}>
                        <div className="progress-player-input dropableRichZone" style={{ height: "20px", position: "relative", bottom: '5px' }}>
                            <div className="fakeProgress" />
                            <div className="mainSlider" style={{ position: "absolute", left: this.state.played * 100 + "%" }} />
                            {markElements}
                        </div>
                    </div>}
            </div>
        );
    }
}
/* eslint-enable react/prop-types */
