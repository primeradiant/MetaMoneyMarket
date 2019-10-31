import React, { HTMLAttributes } from 'react';
import { Heading, Text } from 'rebass';
import Wrapper from '../ui/Wrapper';
import Section from '../ui/Section';
import Container from '../ui/Container';

interface Props extends HTMLAttributes<HTMLDivElement> {
  history: any;
}

const TermsAndConditions: React.FC<Props> = (props: Props) => {
  return (
    <Wrapper redirect={path => props.history.push(path)}>
      <Section>
        <Container>
          <Heading as="h1" variant="h1" mb={4}>
            Terms and conditions
          </Heading>
          <Text as="p" mb={4} variant="subheading">
            Please do not deposit funds except to test this smart contract.
          </Text>
          <Text as="p" variant="paragraph">
            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
            LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO
            EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
            AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
            OR OTHER DEALINGS IN THE SOFTWARE.
          </Text>
        </Container>
      </Section>
    </Wrapper>
  );
};

export default TermsAndConditions;
