import { Button } from 'antd';
import React from 'react';

interface ContactInfo {
  email?: string;
  name?: string;
  url?: string;
}

interface ChildState {
  title?: string;
  description?: string;
  swaggerUrl?: string;
  contact?: ContactInfo;
  xLogoUrl?: string;
}

interface SingleViewProps {
  childState: ChildState;
  handleApiList: () => void;
}

const SingleView: React.FC<SingleViewProps> = ({ childState, handleApiList }) => {
  const {
    title = '',
    description = '',
    swaggerUrl = '',
    contact = {},
    xLogoUrl = '',
  } = childState;

  return (
    <div className='wrapper'>
      <div className='text-center title_wrap'>
        <div className='title_img'>
          <img
            src={xLogoUrl}
            onError={(e) => {
              e.currentTarget.src = 'no-image.svg';
            }}
            alt={`${title} logo`}
          />
        </div>
        <div className='title_name'>{title}</div>
      </div>

      <div className='content_wrap'>
        <h4>Description</h4>
        <p>{description}</p>
      </div>

      <div className='content_wrap'>
        <h4>Swagger</h4>
        <p>
          <a href={swaggerUrl} target='_blank' rel='noopener noreferrer'>
            {swaggerUrl}
          </a>
        </p>
      </div>

      <div className='content_wrap'>
        <h4>Contact</h4>
        <ul className='contact_details'>
          <li>
            <span className='lbl_width'>Email:</span> {contact?.email || 'N/A'}
          </li>
          <li>
            <span className='lbl_width'>Name:</span> {contact?.name || 'N/A'}
          </li>
          <li>
            <span className='lbl_width'>Url:</span> <a href={contact?.url}>{contact?.url??"N/A"}</a>
          </li>
        </ul>
      </div>

      <div className='exploremore'>
        <Button className='button_call'onClick={handleApiList} >Explore More APIs</Button>
      </div>
    </div>
  );
};

export default SingleView;
