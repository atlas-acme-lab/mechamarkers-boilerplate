import io from 'socket.io-client';
import { initMarkers } from './Markers';
import { pointInRect } from './Utils/CollisionDetection';
import { avgCorners } from './Utils/General';
import { mapUVtoCellCoord, mapPointToUV } from './Utils/Quadmap';
import InputGroup from './InputGroup';

let socket;
let markerData;
let inputGroupData = [];

function parseInputs(data) {
  inputGroupData = data.groups.map((i) => (new InputGroup(markerData, i)));
  inputGroupData.forEach((i) => i.calBoundingBox(30));

  // Set markers to be properly inuse
  markerData.forEach((m) => {
    m.inuse = false;

    data.groups.forEach((group, gID) => {
      const { anchorID, inputs } = group;
      // first check anchor
      if (anchorID === m.id) {
        m.type = 'ANCHOR';
        m.groupID = gID;
        m.actorID = -1; // Unset
        m.inuse = true;
        m.timeout = group.detectWindow;
      }
      else {
        // then check inputs
        inputs.forEach((input, iID) => {
          if (m.id === input.actorID) {
            m.type = 'ACTOR';
            m.groupID = gID;
            m.inputID = iID;
            m.inuse = true;
            m.timeout = input.detectWindow;
          }
        });
      }
    });
  });
}

export function mapPointToCanvas(point, canvasW, canvasH) {
  const mappedPoint = mapUVtoCellCoord(mapPointToUV(point));

  if (mappedPoint) {
    return {
      x: mappedPoint.x * canvasW,
      y: mappedPoint.y * canvasH,
    };
  }

  return {
    x: -1000,
    y: -1000,
  };
}

export function getGroup(groupName) {
  // Throw error if group can't be found please
  return inputGroupData.find(g => g.name == groupName);
}

export function getMarker(markerID) {
  return markerData[markerID];
}

export function update(timenow) {
  // Update
  markerData.forEach(m => m.checkPresence(timenow));
  inputGroupData.forEach(i => i.update());
}

export function fetchInputConfig() {
  socket.emit('get inputs config')
}

export function init(canvas, ctx) {
  markerData = initMarkers(ctx);

  socket = io.connect('localhost:5000');
  socket.on('connect', () => socket.emit('get inputs config'));
  socket.on('send inputs config', ({ config }) => parseInputs(JSON.parse(config)));

  socket.on('update markers', (data) => {
    const markers = data.markers;

    if (markers.length > 0) {
      const mappedMarkers = markers.map(m => {
        // include naive conversion here in library
        const mappedCorners = m.corners.map(c => ({ x: c[0], y: c[1] }));

        return {
          id: m.id,
          corner: mappedCorners[0],
          center: avgCorners(mappedCorners),
          allCorners: mappedCorners,
        };
      });

      // HERE IS WHERE THE ARRAY OF MARKERS IS CLEMENT
      // MappedMarkers
      const timenow = Date.now();

      mappedMarkers.forEach(m => {
        if (m !== undefined) {
          markerData[m.id].update(m, timenow);
        }
      });
    }
  });
}
