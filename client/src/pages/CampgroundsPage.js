import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { campgroundService } from '../services/api';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const CampgroundsPage = () => {
  const [campgrounds, setCampgrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapContainer = React.useRef(null);
  const map = React.useRef(null);

  useEffect(() => {
    // Charge les campements depuis l'API
    const fetchCampgrounds = async () => {
      try {
        const data = await campgroundService.getAllCampgrounds();
        setCampgrounds(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching campgrounds:', err);
        setError('Une erreur est survenue lors du chargement des campements.');
        setLoading(false);
      }
    };

    fetchCampgrounds();
  }, []);

  useEffect(() => {
    // Initialise la carte une fois que les campements sont chargés
    if (!loading && campgrounds.length > 0 && !map.current) {
      // Remplacez par votre clé API Mapbox ou Maptiler
      mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN';
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [-74.5, 40], // Position par défaut
        zoom: 3
      });

      // Ajoutez les contrôles de navigation
      map.current.addControl(new mapboxgl.NavigationControl());

      // Créer un GeoJSON avec les campements
      const features = campgrounds.map(camp => ({
        type: 'Feature',
        geometry: camp.geometry,
        properties: {
          id: camp._id,
          title: camp.title,
          description: camp.description
        }
      }));

      map.current.on('load', () => {
        // Ajouter la source et la couche pour les campements
        map.current.addSource('campgrounds', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features
          },
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50
        });

        // Ajouter les clusters
        map.current.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'campgrounds',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#51bbd6',
              10,
              '#f1f075',
              30,
              '#f28cb1'
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              20,
              10,
              30,
              30,
              40
            ]
          }
        });

        // Ajouter le nombre de points dans chaque cluster
        map.current.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'campgrounds',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
          }
        });

        // Ajouter les points individuels
        map.current.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'campgrounds',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#11b4da',
            'circle-radius': 8,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
          }
        });
      });
    }
  }, [loading, campgrounds]);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center my-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h1 className="mb-4">Tous les campements</h1>

      {/* Carte des campements */}
      <div
        ref={mapContainer}
        style={{ width: '100%', height: '400px', marginBottom: '2rem' }}
        className="mb-4"
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <p className="mb-0">{campgrounds.length} campements trouvés</p>
        <Link to="/campgrounds/new">
          <Button variant="success">Ajouter un nouveau campement</Button>
        </Link>
      </div>

      <Row>
        {campgrounds.map(campground => (
          <Col md={6} lg={4} key={campground._id} className="mb-4">
            <Card className="h-100 shadow-sm">
              {campground.images && campground.images.length > 0 ? (
                <Card.Img 
                  variant="top" 
                  src={campground.images[0].url} 
                  style={{ height: '200px', objectFit: 'cover' }} 
                />
              ) : (
                <Card.Img 
                  variant="top" 
                  src="https://res.cloudinary.com/dxeknypze/image/upload/v1722448455/i0z0wnjfgl8klrsm1c2o.jpg" 
                  style={{ height: '200px', objectFit: 'cover' }} 
                />
              )}
              <Card.Body>
                <Card.Title>{campground.title}</Card.Title>
                <Card.Text>
                  {campground.description.length > 100 
                    ? `${campground.description.substring(0, 100)}...` 
                    : campground.description}
                </Card.Text>
                <Card.Text>
                  <small className="text-muted">{campground.location}</small>
                </Card.Text>
              </Card.Body>
              <Card.Footer className="bg-white border-top-0">
                <Link to={`/campgrounds/${campground._id}`}>
                  <Button variant="primary" className="w-100">Voir {campground.title}</Button>
                </Link>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CampgroundsPage;
