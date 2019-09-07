import React, {useState} from 'react';
import {Button, Flex, Box} from 'rebass';
import {Input} from '@rebass/forms';

const SpamBusting = () => (
  <div style={{position: 'absolute', left: '-5000px'}} aria-hidden="true">
    <input type="text" name="b_62a77ff46a9469711efebfd67_1b6a93db6d" tabIndex={-1} defaultValue="" />
  </div>
);

export const MailChimpForm: React.FC = props => {
  const [email, setEmail] = useState('');
  return (
    <Box id="mc_embed_signup" {...props}>
      <Box
        as="form"
        action="https://gmail.us3.list-manage.com/subscribe/post?u=62a77ff46a9469711efebfd67&amp;id=1b6a93db6d"
        method="post"
        id="mc-embedded-subscribe-form"
        name="mc-embedded-subscribe-form"
        target="_blank"
      >
        <Flex id="mc_embed_signup_scroll" flexDirection={['column', 'row']}>
          <Input
            type="email"
            value={email}
            onChange={(e: any) => setEmail(e.currentTarget.value)}
            name="EMAIL"
            id="mce-EMAIL"
            placeholder="Sign up to get early access"
            required={true}
            sx={{
              '::placeholder': {
                color: 'primary',
                opacity: 0.92,
              },
            }}
          />
          <SpamBusting />
          <Box ml={[0, 3]} mt={[3, 0]}>
            <Button
              width={[1, 'unset']}
              as="input"
              type="submit"
              value="Subscribe"
              name="subscribe"
              id="mc-embedded-subscribe"
            />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};
