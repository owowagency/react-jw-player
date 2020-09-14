import React, { Component } from 'react';

import createEventHandlers from './create-event-handlers';
import getCurriedOnLoad from './helpers/get-curried-on-load';
import getPlayerOpts from './helpers/get-player-opts';
import initialize from './helpers/initialize';
import installPlayerScript from './helpers/install-player-script';
import removeJWPlayerInstance from './helpers/remove-jw-player-instance';
import setJWPlayerDefaults from './helpers/set-jw-player-defaults';
import requiresReInitialization from './helpers/requires-re-initialization';

import defaultProps from './default-props';
import propTypes from './player-prop-types';
import updatableProps from './updatable-props';
import getUpdatedPlayerOpts from './helpers/get-updated-player-opts';

const displayName = 'ReactJWPlayer';

class ReactJWPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adHasPlayed: false,
      hasPlayed: false,
      hasFired: {},
    };
    this.eventHandlers = createEventHandlers(this);
    this.uniqueScriptId = 'jw-player-script';

    if (props.useMultiplePlayerScripts) {
      this.uniqueScriptId += `-${props.playerId}`;
    }

    this.videoRef = null;
    this._initialize = this._initialize.bind(this);
    this._setVideoRef = this._setVideoRef.bind(this);
  }
  componentDidMount() {
    const isJWPlayerScriptLoaded = !!window.jwplayer;
    const existingScript = document.getElementById(this.uniqueScriptId);
    const isUsingMultiplePlayerScripts = this.props.useMultiplePlayerScripts;

    if (!isUsingMultiplePlayerScripts && isJWPlayerScriptLoaded) {
      this._initialize();
      return;
    }

    if (isUsingMultiplePlayerScripts && existingScript) {
      this._initialize();
      return;
    }

    if (!existingScript) {
      installPlayerScript({
        context: document,
        onLoadCallback: this._initialize,
        scriptSrc: this.props.playerScript,
        uniqueScriptId: this.uniqueScriptId,
      });
    } else {
      existingScript.onload = getCurriedOnLoad(existingScript, this._initialize);
    }
  }
  shouldComponentUpdate(nextProps) {
    const updatablePropChanged = updatableProps.some(name => this.props[name] !== nextProps[name]);
    return updatablePropChanged || requiresReInitialization(this.props, nextProps);
  }
  componentDidUpdate(prevProps) {
    if (window.jwplayer && window.jwplayer(this.videoRef)) {
      if (requiresReInitialization(prevProps, this.props)) {
        this._initialize();
      } else {
        this._updatePlayer(prevProps);
      }
    }
  }
  componentWillUnmount() {
    removeJWPlayerInstance(this.videoRef, window);
  }
  _updatePlayer(prevProps) {
    const player = window.jwplayer(this.videoRef);
    if (!player) {
      // this player ref may have been destroyed already
      return;
    }

    const playerOpts = getUpdatedPlayerOpts(prevProps, this.props);
    player.setConfig(playerOpts);
  }
  _initialize() {
    const { playerId, useMultiplePlayerScripts } = this.props;

    if (useMultiplePlayerScripts) {
      setJWPlayerDefaults({ context: window, playerId });
    }

    const component = this;
    const player = window.jwplayer(this.videoRef);
    if (!player) {
      // this player ref may have been destroyed already
      return;
    }

    const playerOpts = getPlayerOpts(this.props);

    initialize({ component, player, playerOpts });
  }
  _setVideoRef(element) {
    this.videoRef = element;
  }
  render() {
    return (
      <div className={this.props.className} >
        <div id={this.props.playerId} ref={this._setVideoRef} />
      </div>
    );
  }
}

ReactJWPlayer.defaultProps = defaultProps;
ReactJWPlayer.displayName = displayName;
ReactJWPlayer.propTypes = propTypes;
export default ReactJWPlayer;
