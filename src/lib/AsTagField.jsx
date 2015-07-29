import React from 'react';
import AsTag from './AsTag';

export default class AsTagField extends React.Component {
	static propTypes = {
		value: React.PropTypes.arrayOf(React.PropTypes.string),
		onChange: React.PropTypes.func,
		placeholder: React.PropTypes.string,
		name: React.PropTypes.string
	};
	static defaultProps = {
		value: [],
		onChange: () => {},
		placeholder: 'Add a tag'
	};
  constructor(props) {
		super(props);
		this.state = {
			canDelete: false,
      tags: props.value
		};
	}
	getValue() {
		return this.state.tags;
	}
	setValue(tags) {
		this.setState({
			tags: tags
		});
		this.props.onChange(tags);
	}
	render() {
		var tags = this.state.tags;
  	var highlight = this.state.highlight;
  	var $tags = tags.map((tag, index) => {
			return (highlight && index === tags.length - 1) ? <AsTag highlight>{tag}</AsTag> : <AsTag>{tag}</AsTag>;
  	});
    return (
    	<div className='as-tagfield'>
			  {$tags}
				<input name={this.props.name} type="hidden" value={JSON.stringify(this.state.tags)}></input>
			  <input className='as-tags-input' placeholder={this.props.placeholder} type='text'/>
			</div>
    );
	}
	_createTag(value) {
		if(!value.trim()) return;
		var tags = this.state.tags;
		if(tags.indexOf(value) !== -1) return;
		tags.push(value);
		this.setState({
			tags: tags,
			highlight: false
		});
		this.props.onChange(tags);
	}
	_removeTag() {
		var tags = this.state.tags;
		if(this.state.canDelete) {
			tags = tags.slice(0, -1);
			this.setState({
				tags: tags,
				canDelete: false,
				highlight: false
			});
			this.props.onChange(tags);
		} else
			this.setState({
				highlight: true,
				canDelete: true
			});
	}
	componentDidMount() {
		var $tags = React.findDOMNode(this);
		var $input = $tags.querySelector('.as-tags-input');
		var tags = this.state.tags;
		$input.addEventListener('keyup', (e) => {
			var key;
			key = e.keyCode || e.which;
			if (key === 13 || key === 188) {
				this._createTag($input.value.replace(',', ''));
        $input.value = '';
      } else if (key === 8)
        $input.value === '' && this._removeTag();
      else
        this.setState({
        	highlight: false,
        	canDelete: false
        });
		}, true);
		this.props.onChange(tags);
	}
}
