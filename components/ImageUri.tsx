import React from 'react';
import { Image } from 'react-native';
import { SvgUri } from 'react-native-svg';

interface Props {
  uri: string;
  height: number;
  width: number;
}

export default function ImageUri(props: Props) {
  const isSvg = props.uri.toLocaleLowerCase().endsWith('.svg');

  if (isSvg) {
    return (
      <SvgUri
        width={props.width}
        height={props.height}
        uri={props.uri}
      />
    );

  } else {
    return (
      <Image source={{ uri: props.uri }} style={{ width: props.width, height: props.height }} />
    );
  }
}
