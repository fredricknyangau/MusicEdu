import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TextEditor from '../components/TextEditor';
import '../styles/EditInstrumentPage.css';

const EditInstrumentPage = () => {
  const { instrumentId } = useParams();
  const [instrument, setInstrument] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [historicalBackground, setHistoricalBackground] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [audio, setAudio] = useState(null);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInstrumentDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://music-edu-backend.vercel.app/api/instruments/${instrumentId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch instrument details');
        }

        const data = await response.json();
        setInstrument(data);
        setName(data.name);
        setDescription(data.description);
        setHistoricalBackground(data.historicalBackground);
        setCategory(data.category);
      } catch (error) {
        console.error('Error fetching instrument:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/categories', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchInstrumentDetails();
    fetchCategories();
  }, [instrumentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('historicalBackground', historicalBackground);
    formData.append('category', category);
    if (image) formData.append('image', image);
    if (video) formData.append('video', video);
    if (audio) formData.append('audio', audio);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/instruments/${instrumentId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error updating instrument');
      }

      await response.json();
      alert('Instrument updated successfully');
      navigate('/admin');
    } catch (error) {
      console.error('Error updating instrument:', error);
    }
  };

  if (!instrument) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="edit-instrument-container">
      <h2>Edit Instrument</h2>
      <form onSubmit={handleSubmit} className="edit-instrument-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <TextEditor
            value={description}
            onChange={setDescription}
            placeholder="Enter the description of the instrument"
          />
        </div>

        <div className="form-group">
          <label htmlFor="historicalBackground">Historical Background</label>
          <TextEditor
            value={historicalBackground}
            onChange={setHistoricalBackground}
            placeholder="Enter the historical background of the instrument"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-control"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input
            id="image"
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="form-control-file"
          />
        </div>

        <div className="form-group">
          <label htmlFor="video">Video</label>
          <input
            id="video"
            type="file"
            onChange={(e) => setVideo(e.target.files[0])}
            className="form-control-file"
          />
        </div>

        <div className="form-group">
          <label htmlFor="audio">Audio</label>
          <input
            id="audio"
            type="file"
            onChange={(e) => setAudio(e.target.files[0])}
            className="form-control-file"
          />
        </div>

        <button type="submit" className="submit-button">Update Instrument</button>
      </form>
    </div>
  );
};

export default EditInstrumentPage;
