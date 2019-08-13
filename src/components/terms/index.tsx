import React, {HTMLAttributes} from 'react';
import styled from 'styled-components';

interface Props extends HTMLAttributes<HTMLDivElement> {}

const TermsContainer = styled.div``;

const TermsAndConditions: React.FC<Props> = (props: Props) => {
  const {...restProps} = props;

  return <TermsContainer {...restProps}>
    <h2>Terms and conditions</h2>
Please Do Not Deposit Funds except to test this smart contract. 
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
  
  </TermsContainer>;
};

export default TermsAndConditions;
