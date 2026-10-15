// The compiled Reelscore bundle reads React from window.React at load time.
import * as React from 'react';
if (typeof window !== 'undefined' && !window.React) window.React = React;
