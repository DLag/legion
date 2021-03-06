//
//    Copyright 2019 EPAM Systems
//
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
//
//        http://www.apache.org/licenses/LICENSE-2.0
//
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.
//

package v1alpha1

import (
	. "github.com/onsi/gomega"
	"golang.org/x/net/context"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/types"
	"testing"
)

func TestStorageModelTraining(t *testing.T) {
	key := types.NamespacedName{
		Name:      vcsName,
		Namespace: vcsNamespace,
	}
	created := &ModelTraining{
		ObjectMeta: metav1.ObjectMeta{
			Name:      vcsName,
			Namespace: vcsNamespace,
		},
		Spec: ModelTrainingSpec{
			ToolchainType: "python",
			VCSName:       vcsName,
			Image:         "some-image",
			ModelFile:     "some path",
			Reference:     "some-branch",
			Entrypoint:    "some entrypoint",
		},
	}
	g := NewGomegaWithT(t)

	// Test Create
	fetched := &ModelTraining{}
	g.Expect(c.Create(context.TODO(), created)).NotTo(HaveOccurred())

	g.Expect(c.Get(context.TODO(), key, fetched)).NotTo(HaveOccurred())
	g.Expect(fetched).To(Equal(created))

	// Test Updating the Labels
	updated := fetched.DeepCopy()
	updated.Labels = map[string]string{"hello": "world"}
	g.Expect(c.Update(context.TODO(), updated)).NotTo(HaveOccurred())

	g.Expect(c.Get(context.TODO(), key, fetched)).NotTo(HaveOccurred())
	g.Expect(fetched).To(Equal(updated))

	// Test Delete
	g.Expect(c.Delete(context.TODO(), fetched)).NotTo(HaveOccurred())
	g.Expect(c.Get(context.TODO(), key, fetched)).To(HaveOccurred())
}
