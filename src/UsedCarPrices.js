import React from 'react'
import Select from 'react-select';
import { throttle } from 'lodash';
import SimpleReactValidator from 'simple-react-validator';
import 'bootstrap/dist/css/bootstrap.min.css';
//import $ from 'jquery';
//import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import config from './config';

class UsedCarPrices extends React.Component {
	constructor(props){
		super(props);
		this.validator = new SimpleReactValidator({autoForceUpdate: this});
		this.state = {
			backEndDomain: config.backEndDomain,
			predictModelDomain: config.predictModelDomain,
			disabled: false,
			predictedPrice: "",
			year: "",
			odometer: "",
			manufacturerOptions: [],
			manufacturerOption: "",
			modelOptions: [],
			modelOption: "",
			fuelOptions: [
				{label: "Gas", value: "gas"},
				{label: "Diesel", value: "diesel"},
				{label: "Other", value: "other"},
				{label: "Hybrid", value: "hybrid"},
				{label: "Electric", value: "electric"}
			],
			fuelOption: "",
			transmissionOptions: [
				{label: "Automatic", value: "automatic"},
				{label: "Manual", value: "manual"},
				{label: "Other", value: "other"}
			],
			transmissionOption: "",
			titleStatusOptions: [
				{label: "Clean", value: "clean"},
				{label: "Rebuilt", value: "rebuilt"},
				{label: "Lien", value: "lien"},
				{label: "Missing", value: "missing"},
				{label: "Parts only", value: "parts only"}
			],
			titleStatusOption: "",

		};

		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.throttledHandleManufacturerSearch = throttle(this.handleManufacturerSearch, 500).bind(this);
		this.throttledHandleModelSearch = throttle(this.handleModelSearch, 500).bind(this);
	}

  handleManufacturerSearch = (inputValue) => {

  	if(inputValue !== "" && inputValue !== null){
			fetch(`${this.state.backEndDomain}/manufacturer?manufacturer_name=${inputValue}`, {
			  method: 'GET'
			})
			.then((response) => response.json())
			.then((responseJson) => {
				if(!("errors" in responseJson)){
					var options = responseJson.map((row) =>{
						return(
							{label:row.name, value:row.id}
						)
					});
					this.setState({
						manufacturerOptions: options,
						modelOptions: [],
						modelOption: "",
					});
				}else{
					this.setState({
					});
				}
			})
			.catch((error) => {
  		})
  	}

  };

  handleModelSearch = (inputValue) => {

  	if(inputValue !== "" && inputValue !== null){
			fetch(`${this.state.backEndDomain}/model?manufacturer_id=${this.state.manufacturerOption.value}&model_name=${inputValue}`, {
			  method: 'GET'
			})
			.then((response) => response.json())
			.then((responseJson) => {
				if(!("errors" in responseJson)){
					var options = responseJson.map((row) =>{
						return(
							{label:row.name, value:row.name}
						)
					});
					this.setState({
						modelOptions: options,
					});
				}else{
					this.setState({
					});
				}
			})
			.catch((error) => {
  		})
  	}

  };

  handleManufacturerSelect = (selectedOption) => {
    this.setState({ manufacturerOption: selectedOption });
  };

  handleModelSelect = (selectedOption) => {
    this.setState({ modelOption: selectedOption });
  };

  handleFuelSelect = (selectedOption) => {
    this.setState({ fuelOption: selectedOption });
  };

  handleTransmissionSelect = (selectedOption) => {
    this.setState({ transmissionOption: selectedOption });
  };

  handleTitleStatusSelect = (selectedOption) => {
    this.setState({ titleStatusOption: selectedOption });
  };

	handleChange = (event) => {
		const name = event.target.name
		const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value

		this.setState({
			[name]: value
		});
	}

	handleSubmit = (event) => {
		event.preventDefault();
	  if (this.validator.allValid()) {
			fetch(this.state.predictModelDomain, {
			  method: 'POST',
			  headers: {
			    'Accept': 'application/json',
			    'Content-Type': 'application/json'
			  },
			  body: JSON.stringify({
					manufacturer: this.state.manufacturerOption.label,
					model: this.state.modelOption.label,
					title_status: this.state.titleStatusOption.value,
					fuel: this.state.fuelOption.value,
					transmission: this.state.transmissionOption.value,
					year: this.state.year,
					odometer: this.state.odometer
				})
			})
			.then((response) => response.json())
			.then((responseJson) => {
				this.setState({
					predictedPrice: responseJson.predicted_price
				});
			})
			.catch((error) => {
	  	})
	  } else {
	    this.validator.showMessages();
	  }
	}

	render(){
		return(
			<div className="container pt-3">
				<form className="row" onSubmit={this.handleSubmit}>
					<h3 class="text-center text-success col-12 mb-3">Used car prices</h3> 
					<div className="form-group col-xs-12 col-sm-12 col-md-6 col-lg-6">
						<label>Manufacturer</label>
      			<Select
      				className=""
      			  value={this.state.manufacturerOption}
      			  options={this.state.manufacturerOptions}
      			  onChange={this.handleManufacturerSelect}
							onInputChange={this.throttledHandleManufacturerSearch}
      			/>
      			<span className="text-danger">{ this.validator.message('Manufacturer', this.state.manufacturerOption.label, 'required|min:1') }</span>
					</div>

					<div className="form-group col-xs-12 col-sm-12 col-md-6 col-lg-6">
						<label>Model</label>
      			<Select
      				className=""
      			  value={this.state.modelOption}
      			  options={this.state.modelOptions}
      			  onChange={this.handleModelSelect}
							onInputChange={this.throttledHandleModelSearch}
      			/>
      			<span className="text-danger">{ this.validator.message('Model', this.state.modelOption.label, 'required|min:1') }</span>
					</div>

					<div className="form-group col-xs-12 col-sm-12 col-md-3 col-lg-3">
						<label>Year</label>
						<input className="form-control" type="text" name="year" value={this.state.year} onChange={this.handleChange} placeholder="Year" />
      			<span className="text-danger">{ this.validator.message('Year', this.state.year, 'required|min:1') }</span>
					</div>

					<div className="form-group col-xs-12 col-sm-12 col-md-3 col-lg-3">
						<label>Odometer</label>
						<input className="form-control" type="text" name="odometer" value={this.state.odometer} onChange={this.handleChange} placeholder="Odometer" />
      			<span className="text-danger">{ this.validator.message('Odometer', this.state.odometer, 'required|min:1') }</span>
					</div>

					<div className="form-group col-xs-12 col-sm-12 col-md-6 col-lg-6">
						<label>Fuel</label>
      			<Select
      				className=""
      			  value={this.state.fuelOption}
      			  options={this.state.fuelOptions}
      			  onChange={this.handleFuelSelect}
      			/>
      			<span className="text-danger">{ this.validator.message('Fuel', this.state.fuelOption.value, 'required|min:1') }</span>
					</div>

					<div className="form-group col-xs-12 col-sm-12 col-md-6 col-lg-6">
						<label>Transmission</label>
      			<Select
      				className=""
      			  value={this.state.transmissionOption}
      			  options={this.state.transmissionOptions}
      			  onChange={this.handleTransmissionSelect}
      			/>
      			<span className="text-danger">{ this.validator.message('Transmission', this.state.transmissionOption.value, 'required|min:1') }</span>
					</div>

					<div className="form-group col-xs-12 col-sm-12 col-md-6 col-lg-6">
						<label>Title status</label>
      			<Select
      				className=""
      			  value={this.state.titleStatusOption}
      			  options={this.state.titleStatusOptions}
      			  onChange={this.handleTitleStatusSelect}
      			/>
      			<span className="text-danger">{ this.validator.message('Title status', this.state.titleStatusOption.value, 'required|min:1') }</span>
					</div>

					<div className="col-12 text-center p-3 mb-3 text-success">
						<h4>Estimated price: {this.state.predictedPrice !== "" ? this.state.predictedPrice : 0} USD</h4>
					</div>

					<div className="col-12 text-center p-3">
						<button type="submit" disabled={this.state.disabled} className="btn btn-primary">Send</button>
					</div>

				</form>
			</div>			
		);
	}
}

export default UsedCarPrices;