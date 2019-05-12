import React, { SyntheticEvent } from 'react'
import axios from 'axios'
import { GoogleMap, withScriptjs, withGoogleMap, Marker, Circle } from 'react-google-maps'
import { List, Checkbox, Card, Icon } from 'semantic-ui-react';

const config: any = require('../config')

const MapWithJs = withScriptjs(withGoogleMap((props: any) => {
  const { markers, centerMap, zoom } = props
  const options = { strokeColor: '#ff0000', fillOpacity: 0.0 }
  return (
    <GoogleMap
      zoom={zoom}
      center={centerMap}
    >
      {markers.map((marker: any) => {
        return (marker.show &&
          <>
            <Marker position={marker.center} title={marker.name} />
            {marker.radius ? <Circle
              center={marker.center}
              options={options}
              radius={marker.radius}
            /> : null}
          </>
        )
      })}
    </GoogleMap>
  )
}))

// Filtering devices by their position type(gps, static, antenna)

const filterMarkers = (devices: any) => {
  const markers: object[] = []
  const types = {
    'gps': { radius: 20 },
    'static': { radius: 0 },
    'antenna': { radius: 3000 },
    'other': { radius: 0 }
  }
  Object.entries(types).forEach(([key, value]) => {
    devices = devices.filter((element: any) => {
      if (element.last) {
        for (let data of element.last) {
          if (data.type === 'position') {
            if (data.id === key) {
              data.value.lat && data.value.lng && markers.push({
                id: element.id,
                name: element.name,
                status: element.status,
                show: true,
                radius: value.radius && value.radius,
                center: {
                  lat: data.value.lat,
                  lng: data.value.lng
                }
              })
              return false
            }
            if (key === 'other') {
              data.value.lat && data.value.lng && markers.push({
                center: {
                  lat: data.value.lat,
                  lng: data.value.lng
                }
              })
              return false
            }
          }
        }
      }
      return true
    })
  })
  return markers
}

interface State {
  markers: object[],
  center: object,
  zoom: number,
}

class Map extends React.Component<{}, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      markers: [],
      center: {
        lat: 55.016,
        lng: 82.921,
      },
      zoom: 3,
    }
  }

  async componentDidMount() {
    const token = window.localStorage.getItem('token')
    if (token) {
      const devices = await axios.get('https://report.iotfactory.eu/api/devices?status=all&limit=500&geoloc=true', {
        headers: {
          Authorization: `Session ${token}`
        }
      })
      // const positions = await axios.get('https://report.iotfactory.eu/api/devices/positions', {
      //   headers: {
      //     Authorization: `Session ${token}`      // Can't get all devices positions cause it fails with 504 status code
      //   }                                        // So I get all devices and their last position
      // })
      const markers = filterMarkers(devices.data.data)
      this.setState({ markers })
    }
  }

  filterMarkers = (status: string) => (ev: SyntheticEvent, data: any) : void => {
    let { markers } = this.state
    markers.map((marker: any) => {
      if (marker.status === status) {
        marker.show = data.checked
      }
      return marker
    })
    this.setState({ markers })
  }

  render() {
    const { markers, center, zoom } = this.state
    return (
      <div>
        <div style={{ position: 'absolute' }}>
          <Card style={{ width: '290px', margin: '5px' }}>
            <Card.Content
              header='Markers'
              textAlign='center'
            />
            <Card.Content textAlign='center'>
              <strong>Show</strong>
              <div>
                <Checkbox
                  label='Active'
                  style={{ paddingRight: '7px' }}
                  defaultChecked={true}
                  onChange={this.filterMarkers('active')}
                />
                <Checkbox
                  label='Deleted'
                  defaultChecked={true}
                  onChange={this.filterMarkers('deleted')}
                />
              </div>
            </Card.Content>
            <Card.Content>
              <List style={{ overflow: 'auto', maxHeight: '550px' }} divided>
                {markers.map((marker: any) => marker.show &&
                  <List.Item onClick={() => this.setState({ center: marker.center, zoom: 18 })}>
                    <List.Content
                      floated='left'
                      style={{ maxWidth: '210px', textOverflow: 'ellipsis', overflow: 'hidden' }}
                      as={'a'}
                    >
                      {marker.name}
                    </List.Content>
                    <List.Content
                      floated='right'
                      style={{ margin: '0' }}
                    >
                      <Icon
                        name={marker.status === 'active' ? 'check circle' : 'ban'}
                        color={marker.status === 'active' ? 'green' : 'red'}
                      />
                    </List.Content>
                  </List.Item>  
                )}
              </List>
            </Card.Content>
          </Card>
        </div>
        <MapWithJs
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${config.GOOGLE_MAP_API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
          loadingElement={<div style={{ height: '100%' }} />}
          containerElement={<div style={{ height: '700px', margin: '0px 40px 0px 0px', paddingLeft: '300px' }} />}
          mapElement={<div style={{ height: '100%' }} />}
          markers={markers}
          centerMap={center}
          zoom={zoom}
        />
      </div>
    )
  }
}

export default Map
