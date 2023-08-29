import React, { useEffect, useState } from "react";

import * as spotActions from "../../store/spots";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { csrfFetch } from "../../store/csrf";

export default function CreateSpotForm() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [previewImageURL, setPreviewImageURL] = useState("");
  const [otherImage1, setOtherImage1] = useState("");
  const [otherImage2, setOtherImage2] = useState("");
  const [otherImage3, setOtherImage3] = useState("");
  const [otherImage4, setOtherImage4] = useState("");
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const valErrors = {};

    if (description.length < 30)
      valErrors["description"] = "Description needs 30 or more characters";

    setErrors(valErrors);
  }, [description]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setHasSubmitted(true);

    if (Object.keys(errors).length > 0) return null;

    const spot = {
      address,
      city,
      state,
      country,
      name,
      description,
      price,
    };

    // console.log("spot:", spot);
    const data = await dispatch(
      spotActions.createSpot(JSON.stringify(spot))
    ).catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) {
        // console.log("data:", data);
        setErrors(data.errors);
        return null;
      }
    });

    if (data.id) {
      const previewBody = JSON.stringify({
        url: previewImageURL,
        preview: true,
      });
      csrfFetch(`/api/spots/${data.id}/images`, {
        method: "POST",
        body: previewBody,
      });

      if (otherImage1) {
        csrfFetch(`/api/spots/${data.id}/images`, {
          method: "POST",
          body: JSON.stringify({ url: otherImage1, preview: false }),
        });
      }

      if (otherImage2) {
        csrfFetch(`/api/spots/${data.id}/images`, {
          method: "POST",
          body: JSON.stringify({ url: otherImage2, preview: false }),
        });
      }

      if (otherImage3) {
        csrfFetch(`/api/spots/${data.id}/images`, {
          method: "POST",
          body: JSON.stringify({ url: otherImage3, preview: false }),
        });
      }

      if (otherImage4) {
        csrfFetch(`/api/spots/${data.id}/images`, {
          method: "POST",
          body: JSON.stringify({ url: otherImage4, preview: false }),
        });
      }

      history.push(`/spots/${data.id}`);
    }
  };

  return (
    <>
      <h1>Create a New Spot</h1>
      <form onSubmit={handleSubmit}>
        <section className="location-wrapper">
          <h2>Where's your place located?</h2>
          <p>
            Guests will only get your exact address once they've booked a
            reservation.
          </p>
          <label>
            Country
            <input
              type="text"
              placeholder="Country"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </label>
          <label>
            Street address
            <input
              type="text"
              placeholder="Street Address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>
          <label>
            City
            <input
              type="text"
              placeholder="City"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </label>
          <label>
            State
            <input
              type="text"
              placeholder="State"
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </label>
        </section>
        <section className="description-wrapper">
          <h2>Describe your place to guests</h2>
          <p>
            Mention the best features of your space, any special amenities like
            fast wifi or parking, and what you love about the neighborhood
          </p>
          <textarea
            autoComplete="off"
            placeholder="Please write at least 30 characters"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          {errors.description && hasSubmitted ? (
            <p className="errors">{errors.description}</p>
          ) : null}
        </section>
        <section className="title-wrapper">
          <h2>Create a title for your spot</h2>
          <label>
            <input
              type="text"
              placeholder="Name your spot"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
        </section>
        <section>
          <h2>Set a base price for your spot</h2>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results
          </p>
          <label>
            <input
              type="number"
              placeholder="Price per night (USD)"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>
        </section>
        <section>
          <h2>Liven up your spot with photos</h2>
          <p>Submit a link to at least one photo to publish your spot.</p>
          <label>
            <input
              type="url"
              placeholder="Preview Image URL"
              required
              value={previewImageURL}
              onChange={(e) => setPreviewImageURL(e.target.value)}
            />
            <input
              type="url"
              placeholder="Image URL"
              value={otherImage1}
              onChange={(e) => setOtherImage1(e.target.value)}
            />
            <input
              type="url"
              placeholder="Image URL"
              value={otherImage2}
              onChange={(e) => setOtherImage2(e.target.value)}
            />
            <input
              type="url"
              placeholder="Image URL"
              value={otherImage3}
              onChange={(e) => setOtherImage3(e.target.value)}
            />
            <input
              type="url"
              placeholder="Image URL"
              value={otherImage4}
              onChange={(e) => setOtherImage4(e.target.value)}
            />
          </label>
        </section>
        <button>Create Spot</button>
      </form>
    </>
  );
}