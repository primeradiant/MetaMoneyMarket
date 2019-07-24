export const MailChimpForm = () => {
  return <div
    id="mc_embed_signup"
    style={{clear: 'left', font: '14px Helvetica,Arial,sans-serif', width: '100%', marginBottom: '2rem'}}
  >
    <form
      action="https://gmail.us3.list-manage.com/subscribe/post?u=62a77ff46a9469711efebfd67&amp;id=1b6a93db6d"
      method="post"
      id="mc-embedded-subscribe-form"
      name="mc-embedded-subscribe-form"
      className="validate"
      target="_blank"
      noValidate={true}
    >
      <div id="mc_embed_signup_scroll">
        <input
          type="email"
          value=""
          name="EMAIL"
          className="email"
          id="mce-EMAIL"
          placeholder="Sign up to get early access"
          required={true}
        />
        <div style={{position: 'absolute', left: '-5000px'}} aria-hidden="true">
          <input type="text" name="b_62a77ff46a9469711efebfd67_1b6a93db6d" tabIndex={-1} value="" />
        </div>
        <div className="clear">
          <input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" className="button" />
        </div>
      </div>
    </form>
  </div>
};
